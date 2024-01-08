import { characteristics, damageTypes, skills } from './constants.js';
import { DamageRoll } from './documents/rolls/damage/damage-roll.js';
import { DamageRollDialog } from './documents/rolls/damage/roll-dialog/roll-dialog.js';
import { ResistanceRoll } from './documents/rolls/resistance/resistance-roll.js';
import { ResistanceRollDialog } from './documents/rolls/resistance/roll-dialog/roll-dialog.js';
import { TestRollDialog } from './documents/rolls/test/roll-dialog/roll-dialog.js';
import { getRollActor } from './helpers.js';

export function registerCustomEnrichers() {
    CONFIG.TextEditor.enrichers.push({
        pattern: /@(?<type>Damage)\[(?<formula>[^\]\|]+)(?:\|*(?<config>.*))\]/gi,
        enricher: enrichDamage,
    });

    CONFIG.TextEditor.enrichers.push({
        pattern: /@(?<type>Test)\[(?:\|*(?<config>.*))\]/gi,
        enricher: enrichTest,
    });

    CONFIG.TextEditor.enrichers.push({
        pattern: /@(?<type>Resistance)\[(?<characteristic>[A-Za-z]+)(?:\|*(?<config>.*))\]/gi,
        enricher: enrichResistance,
    });

    document.body.addEventListener('click', rollAction);
    document.body.addEventListener('click', postRollToChat);
    // @Damage[1d6+2|type=holy|traits=Attack,Magic]
}

function _getEnrichedOptions(match, options) {
    let { formula, config, type, characteristic } = match.groups;
    let data = {};
    config = config.split('|');
    config.forEach((option) => {
        let [key, value] = option.split('=');
        if (['boons', 'banes', 'impacts'].includes(key)) data[key] = Number(value);
        else data[key] = value;
    });

    data.boons ??= 0;
    data.banes ??= 0;
    data.actor = options.actor ?? options.rollData?.parent;
    data.actorId = data.actor?.uuid;
    data.item = options.item;
    data.replaceCharacteristic = data.replaceCharacteristic === 'false' ? false : true;

    if (type.toLowerCase() === 'damage') {
        data.baseFormula = formula;
    } else if (type.toLowerCase() === 'test') {
        data.baseFormula = '2d6';
    } else if (type.toLowerCase() === 'resistance') {
        data.baseFormula = '2d6';
        data.characteristic = characteristic;
    }

    // Remove invalid characteristic from data
    if (data.characteristic && !characteristics.includes(data.characteristic)) delete data.characteristic;

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
    let link = createRollLink('damage', linkText, data.formula, data, false);

    return link;
}

function enrichTest(match, options) {
    let data = _getEnrichedOptions(match, options);

    console.log('test data', data);

    // Don't enrich when invalid skill is provided.
    if (!data.skill && !skills.includes(data.skill)) return false;

    let tn = data.tn ?? options.tn;
    if (Number.isNumeric(tn)) {
        data.tn = Number(tn);
    } else {
        if (data.tn === 'easy') data.tn = 7;
        else if (data.tn === 'moderate') data.tn = 9;
        else if (data.tn === 'hard') data.tn = 12;
        else data.tn = null;
    }
    console.log('tn', data.tn);

    let localizedSkill = game.i18n.localize(`skills.${data.skill?.toLowerCase()}.label`);
    let subskillText = ['knowledge', 'craft'].includes(data.skill) && data.subskill ? ` (${data.subskill})` : '';
    let tnText = data.tn ? `TN ${data.tn} ` : '';
    let linkText = '';
    if (data.characteristic) {
        let localizedCharacteristic = game.i18n.localize(`characteristics.${data.characteristic?.toLowerCase()}.label`);
        linkText = `${tnText}${localizedCharacteristic}-${localizedSkill}${subskillText} Test`;
    } else {
        linkText = `${tnText}${localizedSkill}${subskillText} Test`;
    }
    let link = createRollLink('test', linkText, data.formula, data, true);

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

    if (!data.characteristic) return false;

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

    let tnText = data.tn ? `${data.tn} ` : '';
    let localizedCharacteristic = game.i18n.localize(`characteristics.${data.characteristic?.toLowerCase()}.label`);
    let linkText = `${tnText} ${localizedCharacteristic} Resists`;
    let link = createRollLink('resistance', linkText, data.formula, data, true);

    return link;
}

function createRollLink(type, label, formula, dataset, postToChat = false) {
    const span = document.createElement('span');
    span.classList.add('roll-container');

    const rollLink = document.createElement('a');
    rollLink.classList.add('roll-link');
    rollLink.classList.add(`roll-${type}`);
    _addDataset(rollLink, dataset);
    rollLink.innerHTML = `<i class="fa-solid fa-dice-d6"></i> ${label}`;
    span.appendChild(rollLink);

    if (postToChat) {
        const toChatLink = document.createElement('a');
        toChatLink.classList.add('roll-to-chat');
        toChatLink.classList.add(`roll-${type}-to-chat`);
        _addDataset(toChatLink, dataset);

        toChatLink.dataset.replaceCharacteristic = false;
        toChatLink.innerHTML = '<i class="fa-solid fa-message"></i>';
        span.appendChild(toChatLink);
    }

    return span;
}

function _addDataset(element, dataset) {
    for (const [key, value] of Object.entries(dataset)) {
        if (!['input', 'values', 'actor', 'item'].includes(key) && value) element.dataset[key] = value;
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
    else return console.error('No accepted roll type provided; must be damage, resistance, or test');
}

async function rollDamage(event) {
    const target = event.target.closest('.roll-link.roll-damage');
    let { actor, applyKitDamage, baseFormula, banes, boons, characteristic, damageType, formula, impacts } = await getRollContextData(target.dataset);

    let context = {
        actor,
        applyKitDamage,
        baseFormula,
        banes,
        boons,
        characteristic,
        damageType,
        formula,
        impacts,
    };
    await new DamageRollDialog(context).render(true);
}

async function rollTest(event) {
    const target = event.target.closest('.roll-link.roll-test');
    let { actor, baseFormula, banes, boons, characteristic, formula, skill, subskill, tn } = await getRollContextData(target.dataset);
    console.log('test roll');

    // set skill proficiency
    let proficient;
    if (['craft', 'knowledge'].includes(skill)) proficient = actor?.system.skills[skill].find((sub) => sub.subskill === subskill)?.proficient ?? false;
    else proficient = actor?.system.skills[skill].proficient;

    // set skill characteristic if there is none;
    if (!characteristic) {
        if (['craft', 'knowledge'].includes(skill)) characteristic = actor?.system.skills[skill].find((sub) => sub.subskill === subskill)?.characteristic;
        else characteristic = actor?.system.skills[skill].characteristic;
    }

    let context = {
        actor,
        baseFormula,
        banes,
        boons,
        characteristic,
        formula,
        proficient,
        skill,
        subskill,
        tn,
    };
    await new TestRollDialog(context).render(true);
}

async function rollResistance(event) {
    const target = event.target.closest('.roll-link.roll-resistance');
    let { actor, baseFormula, banes, boons, characteristic, formula, tn } = await getRollContextData(target.dataset);

    let context = {
        actor,
        baseFormula,
        banes,
        boons,
        characteristic,
        formula,
        tn,
    };
    await new ResistanceRollDialog(context).render(true);
}

async function getRollContextData(dataset) {
    let { actorId, applyKitDamage, baseFormula, boons, banes, characteristic, damageType, formula, impacts, skill, subskill, tn } = { ...dataset };

    boons = Math.abs(Number(boons) || 0);
    banes = Math.abs(Number(banes) || 0);
    impacts = Math.abs(Number(impacts) || 0);

    let actor;
    if (dataset.actorId) actor = await fromUuid(actorId);
    else actor = await getRollActor();

    return { actor, actorId, applyKitDamage, baseFormula, boons, banes, characteristic, damageType, formula, impacts, skill, subskill, tn };
}

async function postRollToChat(event) {
    const target = event.target.closest('.roll-to-chat');
    if (!target) return;

    if (target.classList.contains('roll-damage-to-chat')) postDamageToChat({ dataset: target.dataset });
    else if (target.classList.contains('roll-resistance-to-chat')) postResistanceToChat({ dataset: target.dataset });
    else if (target.classList.contains('roll-test-to-chat')) postTestToChat({ dataset: target.dataset });
    else return console.error('No accepted roll type provided; must be damage, resistance, or test');
}

function postResistanceToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic', 'characteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }

    let rollMessage = `@Resistance[${dataset.characteristic}${options}]`;
    ChatMessage.create({ content: rollMessage });
}

function postTestToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }
    options = `${options}|replaceCharacteristic=false`;
    let rollMessage = `@Test[${baseFormula}${options}]`;
    ChatMessage.create({ content: rollMessage });
}

function postDamageToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }
    options = `${options}|replaceCharacteristic=false`;

    let baseFormula = target.dataset.baseFormula ?? 0;
    let rollMessage = `@Damage[${baseFormula}${options}]`;
    ChatMessage.create({ content: rollMessage });
}
