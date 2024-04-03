import { CHARACTERISTICS } from '../constants/characteristics.js';
import { capitalize } from '../helpers.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from './helpers.js';

function enrichTest(match, options) {
    /* Currently accounted for  config options

    replaceCharacteristic = should a characteristic be replaced with it's value in the formatted roll - default true
    edges = # of edges to apply to roll
    banes = number of banes to apply to roll
    characteristic = charcteristic to add to the roll
    */
    let data = _getEnrichedOptions(match, options);

    if (!data.skill) return false;
    let linkText = capitalize(data.skill);
    if (data.characteristic && data.characteristic in CHARACTERISTICS) {
        const localizedCharacteristic = game.i18n.localize(`system.characteristics.${data.characteristic}.label`);
        linkText = `${localizedCharacteristic}-${linkText}`;
    }
    let link = createRollLink('test', linkText, '', data, false);

    return link;
}

async function rollTest(event) {
    const eventTarget = event.target.closest('.roll-link.roll-test');
    let data = await getRollContextData(eventTarget.dataset);

    if (!data.actor) return ui.notifications.error('No valid actor selected');
    console.log('data', data);
    data.actor.rollSkillTest(data);
}

function postTestToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }
    options = `${options}|replaceCharacteristic=false`;

    let baseFormula = target.dataset.baseFormula ?? 0;
    let rollMessage = `@Test[${baseFormula}${options}]`;
    ChatMessage.create({ content: rollMessage });
}

export { enrichTest, postTestToChat, rollTest };
