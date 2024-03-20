import { tnDifficulty } from '../constants.js';
import { CHARACTERISTICS } from '../constants/characteristics.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from '../enrichers/helpers.js';
import { ResistanceRoll } from '../rolls/_index.js';

function enrichResistance(match, options) {
    let data = _getEnrichedOptions(match, options);
    /* Currently accounted for  config options

    replaceCharacteristic = should a characteristic be replaced with it's value in the formatted roll - default true
    boons = # of boons to apply to roll
    banes = number of banes to apply to roll
    tn = the tn to roll against 
    characteristic = charcteristic to add to the roll
    */

    // Return early if there's no characteristic
    if (!data.characteristic) return false;

    data.formula = ResistanceRoll.constructFinalFormula(data.baseFormula, data);

    if (data.tn in tnDifficulty) data.tn = tnDifficulty[data.tn];
    if (!data.tn && options.actor) {
        let bonusTN = options.actor.type === 'monster' ? options.actor.system.bonusDamage : options.actor.system.kit?.system.damage;
        data.tn = 6 + options.actor.system.highest + (bonusTN ?? 0);
    }

    let linkText = game.i18n.format('system.rolls.resistance.button', {
        tn: data.tn ? `${data.tn} ` : '',
        characteristicAbbreviation: game.i18n.localize(CHARACTERISTICS[data.characteristic].abbreviation),
    });
    let link = createRollLink('resistance', linkText, data.formula, data, true);

    return link;
}

async function rollResistance(event) {
    const target = event.target.closest('.roll-link.roll-resistance');
    let data = await getRollContextData(target.dataset);

    if (!data.actor) return ui.notifications.error('No valid actor selected');
    data.actor.rollResistance(data);
}

function postResistanceToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic', 'characteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }

    let rollMessage = `@Resistance[${dataset.characteristic}${options}]`;
    ChatMessage.create({ content: rollMessage });
}

export { enrichResistance, postResistanceToChat, rollResistance };
