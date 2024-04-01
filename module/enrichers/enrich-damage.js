import { DAMAGE } from '../constants/_index.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from '../enrichers/helpers.js';
import { DamageRoll } from '../rolls/_index.js';

function enrichDamage(match, options) {
    /* Currently accounted for  config options

    type = damage type
    replaceCharacteristic = should a characteristic be replaced with it's value in the formatted roll - default true
    edges = # of edges to apply to roll
    banes = number of banes to apply to roll
    characteristic = charcteristic to add to the roll
    */
    let data = _getEnrichedOptions(match, options);

    data.type = data.type in DAMAGE.TYPES ? data.type : 'untyped';
    data.formula = new DamageRoll(data.baseFormula, {}, data).formula;
    data.replaceCharacteristic ??= true;
    data.abilityName = game.i18n.localize(data.abilityName ?? data.item?.name ?? '');

    let linkText = `${data.formula}${data.type !== 'untyped' ? ' ' + data.type : ''}`;
    let link = createRollLink('damage', linkText, data.formula, data, false);

    return link;
}

async function rollDamage(event) {
    const eventTarget = event.target.closest('.roll-link.roll-damage');
    let data = await getRollContextData(eventTarget.dataset);

    if (!data.actor) return ui.notifications.error('No valid actor selected');
    data.actor.rollDamage(data);
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
