import { damageTypes } from './constants.js';
import { DamageRoll } from './documents/rolls/damage/damage-roll.js';
import { DamageRollDialog } from './documents/rolls/damage/roll-dialog/roll-dialog.js';
import { ResistanceRoll } from './documents/rolls/resistance/resistance-roll.js';
import { ResistanceRollDialog } from './documents/rolls/resistance/roll-dialog/roll-dialog.js';

export function registerCustomEnrichers() {
    CONFIG.TextEditor.enrichers.push({
        pattern: /@Damage\[(?<formula>[^\]\|]+)(?:\|*(?<config>.*))\]/gi,
        enricher: enrichDamage,
    });

    CONFIG.TextEditor.enrichers.push({
        pattern: /@Test\[(?<formula>[^\]\|]+)(?:\|*(?<config>.*))\]/gi,
        enricher: enrichTest,
    });

    CONFIG.TextEditor.enrichers.push({
        pattern: /@Resistance\[(?<formula>[^\]\|]+)(?:\|*(?<config>.*))\]/gi,
        enricher: enrichResistance,
    });

    document.body.addEventListener('click', rollAction);
    // @Damage[1d6+2|type=holy|traits=Attack,Magic]
}

function _getEnrichedOptions(match, options) {
    let { formula, config } = match.groups;
    let data = {};
    config = config.split('|');
    config.forEach((option) => {
        let [key, value] = option.split('=');
        if (['boons', 'banes', 'impacts'].includes(key)) data[key] = Number(value);
        else data[key] = value;
    });

    data.boons ??= 0;
    data.banes ??= 0;

    data.baseFormula = formula;
    data.actor = options.actor;
    data.actorId = data.actor?.uuid;
    data.item = options.item;
    data.replaceCharacteristic = data.replaceCharacteristic === 'false' ? false : true;

    return data;
}

function enrichDamage(match, options) {
    /* Currently accounted for  config options

    type = damage type
    replaceCharacteristic = should a characteristic be replaced with it's value in the formatted roll - default true
    applyKitDamage = should a kits damage apply to the roll - default true
    boons = # of boons to apply to roll
    banes = number of banes to apply to roll
    impacts = number of impact dice to roll
    characteristic = charcteristic to add to the roll
    */
    let data = _getEnrichedOptions(match, options);

    data.type = damageTypes.includes(data.type) ? data.type : 'untyped';
    data.applyKitDamage = data.applyKitDamage === 'false' ? false : true;
    data.formula = DamageRoll.constructFinalFormula(data.baseFormula, data);
    data.replaceCharacteristic ??= true;
    data.impacts ??= 0;

    let linkText = `${data.formula}${data.type !== 'untyped' ? ' ' + data.type : ''}`;
    let link = createRollLink('damage', linkText, data.formula, data);

    return link;
}

function enrichTest(match, options) {
    let data = _getEnrichedOptions(match, options);

    data.tn = Number(data.tn) ?? Number(options.tn);
    if (Number.isNaN(data.tn)) {
        if (data.tn === 'easy') data.tn = 7;
        else if (data.tn === 'hard') data.tn = 12;
        else if (data.tn === 'moderate') data.tn = 9;
        else data.tn = null;
    }

    let link = createRollLink('test', data.formula, data);
    let localizedCharacteristic = game.i18n.localize(`characteristics.${data.characteristic}.label`);
    let localizedSkill = game.i18n.localize(`skills.${data.skill}.label`);
    let subskillText = data.subskill ? ` (${data.subskill})` : '';
    link.innerHTML = `<i class="fa-solid fa-dice-d6"></i> ${data.tn ? data.tn : ''} ${localizedCharacteristic}-${localizedSkill}${subskillText} Test`;

    return link;
}

function enrichResistance(match, options) {
    let data = _getEnrichedOptions(match, options);
    /* Currently accounted for  config options

    replaceCharacteristic = should a characteristic be replaced with it's value in the formatted roll - default true
    boons = # of boons to apply to roll
    banes = number of banes to apply to roll
    tn = the tn to roll against 
    characteristic = charcteristic to add to the roll
    */
    data.formula = ResistanceRoll.constructFinalFormula(data.baseFormula, data);
    let tn = data.tn ?? options.tn;
    if (Number.isNumeric(tn)) {
        data.tn = Number(tn);
    } else {
        if (data.tn === 'easy') data.tn = 7;
        else if (data.tn === 'moderate') data.tn = 9;
        else if (data.tn === 'hard') data.tn = 12;
        else {
            if (options.actor) {
                let bonusTN = options.actor.type === 'monster' ? options.actor.system.bonusDamage : options.actor.system.kit?.system.damage;
                data.tn = 6 + options.actor.system.highest + (bonusTN ?? 0);
            } else {
            }
        }
    }
    let linkText = `${data.tn ?? ''} ${game.i18n.localize('characteristics.' + data.characteristic + '.abbreviation')} Resists`;
    let link = createRollLink('resistance', linkText, data.formula, data);

    return link;
}

function createRollLink(type, label, formula, dataset) {
    const span = document.createElement('span');
    span.classList.add('roll-container');

    const rollLink = document.createElement('a');
    rollLink.classList.add('roll-link');
    rollLink.classList.add(`roll-${type}`);

    const toChatLink = document.createElement('a');
    toChatLink.classList.add('roll-to-chat');
    toChatLink.classList.add(`roll-${type}-to-chat`);

    _addDataset(rollLink, dataset);
    _addDataset(toChatLink, dataset);
    toChatLink.dataset.replaceCharacteristic = false;
    rollLink.innerHTML = `<i class="fa-solid fa-dice-d6"></i> ${label}`;
    toChatLink.innerHTML = '<i class="fa-solid fa-message"></i>';

    span.appendChild(rollLink);
    span.appendChild(toChatLink);

    return span;
}

function _addDataset(element, dataset) {
    for (const [key, value] of Object.entries(dataset)) {
        if (!['input', 'values', 'actor'].includes(key) && value) element.dataset[key] = value;
    }
}

async function rollAction(event) {
    const target = event.target.closest('.roll-link');
    if (!target) return;
    const isDamage = target.classList.contains('roll-damage');
    const isTest = target.classList.contains('roll-test');
    const isResistance = target.classList.contains('roll-resistance');
    if (isDamage) rollDamage(event);
    else if (isTest) rollTest(event);
    else if (isResistance) rollResistance(event);
    else console.error('Roll link is not of type: damage, test, or resistance');
}

async function rollDamage(event) {
    const target = event.target.closest('.roll-link.roll-damage');
    let { actor, actorId, applyKitDamage, baseFormula, boons, banes, characteristic, damageType, formula, impacts } = getRollContextData(target.dataset);

    let context = {
        actor,
        characteristic,
        banes,
        boons,
        impacts,
        baseFormula,
        formula,
        damageType,
        applyKitDamage,
    };
    await new DamageRollDialog({ context }).render(true);
}

async function rollTest(event) {
    const target = event.target.closest('.roll-link.roll-test');
    console.log('test');
}

async function rollResistance(event) {
    const target = event.target.closest('.roll-link.roll-resistance');
    let { actor, baseFormula, boons, banes, characteristic, formula, tn } = await getRollContextData(target.dataset);

    let context = {
        actor,
        banes,
        boons,
        baseFormula,
        formula,
        characteristic,
        tn,
    };
    await new ResistanceRollDialog({ context }).render(true);
}

async function getRollActor() {
    const speaker = ChatMessage.implementation.getSpeaker();
    const speakerActor = ChatMessage.implementation.getSpeakerActor(speaker);
    let actor;
    if (speakerActor) actor = speakerActor;
    else actor = null;
    return actor;
}

async function getRollContextData(target) {
    let { actorId, applyKitDamage, baseFormula, boons, banes, characteristic, damageType, formula, impacts, tn } = target.dataset;

    boons = Math.abs(Number(boons) || 0);
    banes = Math.abs(Number(banes) || 0);
    impacts = Math.abs(Number(impacts) || 0);

    let actor;
    if (actorId) actor = await fromUuid(actorId);
    else actor = await getRollActor();

    return { actor, actorId, applyKitDamage, baseFormula, boons, banes, characteristic, damageType, formula, impacts, tn };
}
