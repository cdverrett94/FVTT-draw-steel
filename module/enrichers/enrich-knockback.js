import { _getEnrichedOptions, createRollLink, getRollContextData } from '../enrichers/helpers.js';

async function enrichKnockback(match, options) {
    let data = await _getEnrichedOptions(match, options);

    let label = `${game.i18n.localize('system.terms.knockback.label')} ${data.distance}`;

    let link = createRollLink({
        enrichType: data.enrichType,
        label,
        data,
        postToChat: false,
    });

    return link;
}

async function rollKnockback(event) {
    const eventTarget = event.target.closest('.roll-link.roll-damage');
    let data = await getRollContextData(eventTarget.dataset);

    if (!data.actor) return ui.notifications.error('No valid actor selected');
    data.actor.rollKnockback(data);
}

function postKnockbackToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }
    options = `${options}|replaceCharacteristic=false`;

    let baseFormula = target.dataset.baseFormula ?? 0;
    let rollMessage = `@Knockback[${baseFormula}${options}]`;
    ChatMessage.create({ content: rollMessage });
}

export { enrichKnockback, postKnockbackToChat, rollKnockback };
