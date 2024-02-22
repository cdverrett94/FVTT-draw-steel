import { DamageRoll } from '../documents/rolls/damage/damage-roll.js';
import { DamageRollDialog } from '../documents/rolls/damage/roll-dialog/roll-dialog.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from '../enrichers.js';

function enrichDamage(match, options) {
    /* Currently accounted for  config options

    type = damage type
    replaceCharacteristic = should a characteristic be replaced with it's value in the formatted roll - default true
    applyExtraDamage = should a kits damage apply to the roll - default true
    boons = # of boons to apply to roll
    banes = number of banes to apply to roll
    impacts = number of impact dice to roll
    characteristic = charcteristic to add to the roll
    */
    let data = _getEnrichedOptions(match, options);

    data.type = data.type in damageTypes ? data.type : 'untyped';
    data.applyExtraDamage = data.applyExtraDamage === 'false' ? false : true;
    data.formula = DamageRoll.constructFinalFormula(data.baseFormula, data);
    data.replaceCharacteristic ??= true;
    data.impacts ??= 0;

    let linkText = `${data.formula}${data.type !== 'untyped' ? ' ' + data.type : ''}`;
    let link = createRollLink('damage', linkText, data.formula, data, false);

    return link;
}

async function rollDamage(event) {
    const target = event.target.closest('.roll-link.roll-damage');
    let { actor, applyExtraDamage, baseFormula, banes, boons, characteristic, damageType, formula, impacts } = await getRollContextData(target.dataset);

    let context = {
        actor,
        applyExtraDamage,
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

export { enrichDamage, postDamageToChat, rollDamage };
