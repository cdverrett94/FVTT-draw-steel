import { damageTypes } from '../constants.js';
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
    const eventTarget = event.target.closest('.roll-link.roll-damage');
    let { actor, applyExtraDamage, baseFormula, banes, boons, characteristic, damageType, formula, impacts } = await getRollContextData(eventTarget.dataset);

    if (actor?.system.banes.attacker) banes += Number(actor.system.banes.attacker);
    if (actor?.system.boons.attacker) boons += Number(actor.system.boons.attacker);

    // General boon/bane adjustments from effects
    let [target] = game.user.targets;
    if (target) {
        if (target.actor.system.boons.attacked) boons += target.actor.system.boons.attacked;
        if (target.actor.system.banes.attacked) banes += target.actor.system.banes.attacked;
    }

    // boon/bane adjustments from frightened
    if (actor?.system.frightened && target && actor?.system.frightened.includes(target?.actor.uuid)) banes += 1;
    if (target?.actor.system.frightened && actor && target?.actor.system.frightened.includes(actor?.uuid)) banes += 1;

    // boon/bane adjustments from taunted
    if (actor?.system.taunted.length && target && !actor?.system.taunted.includes(target.actor.uuid)) banes += 1;

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
