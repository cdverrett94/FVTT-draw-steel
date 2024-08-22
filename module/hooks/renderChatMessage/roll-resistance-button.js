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

        new ResistanceRollDialog({
            actor: rollingActor,
            origin: originActor,
            characteristic,
            ability,
        }).render(true);
    });
}
