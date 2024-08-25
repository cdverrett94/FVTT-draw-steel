import { ResistanceRollDialog } from '../../rolls/_index.js';
import { createTargetButton } from './helpers.js';

export function createResistanceRollButton(document, html) {
    if (!document.system.isResistance) return;
    const dataset = {};
    const classes = ['roll-resistance-button'];
    const text = game.i18n.localize('system.rolls.resistance.rollButton');
    const disabled = false;
    const registerListeners = resistanceRollListeners;
    const resistanceButton = createTargetButton(document, dataset, classes, text, disabled, registerListeners);

    html.querySelector('.ability').insertAdjacentElement('afterend', resistanceButton);
}

function resistanceRollListeners(element, document, index) {
    element.addEventListener('click', async (event) => {
        if (canvas.tokens.controlled.length !== 1) return ui.notifications.error('Please select one token for rolling');

        const rollingActor = canvas.tokens.controlled[0].actor;
        const originActor = await fromUuid(document.system.origin.actor);
        const ability = await fromUuid(document.system.origin.item);
        const characteristic = ability?.power.characteristic;

        const modifiers = getResistanceModifiers(rollingActor);
        new ResistanceRollDialog({
            actor: rollingActor,
            origin: originActor,
            characteristic,
            ability,
            general: {
                ...modifiers,
            },
        }).render(true);
    });
}

function getResistanceModifiers(actor) {
    const rollData = {
        edges: 0,
        banes: 0,
        bonuses: 0,
    };

    if (actor.system.banes.resistance) rollData.banes += Number(actor.system.banes.resistance);
    if (actor.system.edges.resistance) rollData.edges += Number(actor.system.edges.resistance);
    if (actor.system.bonuses.resistance) rollData.bonuses += Number(actor.system.bonuses.resistance);

    return rollData;
}
