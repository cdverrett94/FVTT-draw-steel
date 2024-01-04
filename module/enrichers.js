import { damageTypes } from './constants.js';
import { DamageRoll } from './documents/rolls/damage-roll.js';
import { MCDMRollDialog } from './documents/rolls/roll-dialog/roll-dialog.js';

export function registerCustomEnrichers() {
    CONFIG.TextEditor.enrichers.push({
        pattern: /@Damage\[(?<formula>[^\]\|]+)(?:\|*(?<config>.*))\]/gi,
        enricher: enrichDamage,
    });

    document.body.addEventListener('click', rollDamage);
    // @Damage[1d6+2|type=holy|traits=Attack,Magic]
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
    let { formula, config } = match.groups;
    let data = {};
    config = config.split('|');
    config.forEach((option) => {
        let [key, value] = option.split('=');
        data[key] = value;
    });

    data.type = damageTypes.includes(data.type) ? data.type : 'untyped';
    data.formula = formula;
    data.actor = options.actor;
    data.actorId = data.actor?.uuid;
    data.replaceCharacteristic = data.replaceCharacteristic === 'false' ? false : true;
    data.applyKitDamage = data.applyKitDamage === 'false' ? false : true;

    return createRollLink(formula, data);
}

function createRollLink(formula, dataset) {
    const link = document.createElement('a');
    link.classList.add('roll-link');
    link.classList.add('roll-damage');
    if (dataset.replaceCharacteristic) formula = new DamageRoll(DamageRoll.constructFinalFormula(formula, dataset), {}, dataset)._formula;

    _addDataset(link, dataset);
    link.innerHTML = `<i class="fa-solid fa-dice-d6"></i> ${formula}${dataset.type !== 'untyped' ? ' ' + dataset.type : ''}`;

    return link;
}

function _addDataset(element, dataset) {
    for (const [key, value] of Object.entries(dataset)) {
        if (!['input', 'values', 'actor'].includes(key) && value) element.dataset[key] = value;
    }
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
