import { damageTypes } from './constants.js';
import { DamageRoll } from './documents/rolls/damage-roll.js';
import { MCDMRollDialog } from './documents/rolls/roll-dialog/roll-dialog.js';

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
        data[key] = value;
    });

    data.formula = formula;
    data.actor = options.actor;
    data.actorId = data.actor?.uuid;
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
    */
    let data = _getEnrichedOptions(match, options);

    data.type = damageTypes.includes(data.type) ? data.type : 'untyped';
    data.applyKitDamage = data.applyKitDamage === 'false' ? false : true;
    if (data.replaceCharacteristic) data.formula = new DamageRoll(DamageRoll.constructFinalFormula(data.formula, data), {}, data)._formula;

    let link = createRollLink('damage', data.formula, data);

    link.innerHTML = `<i class="fa-solid fa-dice-d6"></i> ${data.formula}${data.type !== 'untyped' ? ' ' + data.type : ''}`;

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

    data.tn = Number(data.tn) ?? Number(options.tn);
    if (Number.isNaN(data.tn)) {
        if (data.tn === 'easy') data.tn = 7;
        else if (data.tn === 'hard') data.tn = 12;
        else data.tn = 9;
    }
    console.log('resistance data', data);

    let link = createRollLink('resistance', data.formula, data);

    link.innerHTML = `<i class="fa-solid fa-dice-d6"></i> ${data.tn} ${game.i18n.localize('characteristics.' + data.characteristic + '.abbreviation')} Resists`;

    return link;
}

function createRollLink(type, formula, dataset) {
    const link = document.createElement('a');
    link.classList.add('roll-link');
    link.classList.add(`roll-${type}`);

    _addDataset(link, dataset);

    return link;
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
}

async function rollDamage(event) {
    const target = event.target.closest('.roll-link.roll-damage');
    if (!target) return;

    let formula = target.dataset.formula;
    let damageType = target.dataset.type;
    let actorId = target.dataset.actorId;
    let boons = Math.abs(Number(target.dataset.boons) || 0);
    let banes = Math.abs(Number(target.dataset.banes) || 0);
    let impacts = Math.abs(Number(target.dataset.impacts) || 0);
    let applyKitDamage = target.dataset.applyKitDamage;

    let context = {
        actor: await fromUuid(actorId),
        banes,
        boons,
        impacts,
        baseFormula: formula,
        damageType,
        applyKitDamage,
    };
    await new MCDMRollDialog({ context }).render(true);
}

async function rollTest(event) {
    const target = event.target.closest('.roll-link.roll-test');
    if (!target) return;

    console.log('test');
}

async function rollResistance(event) {
    const target = event.target.closest('.roll-link.roll-resistance');
    if (!target) return;

    console.log('resistance');
}
