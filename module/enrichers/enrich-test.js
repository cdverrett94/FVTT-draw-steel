import { CHARACTERISTICS, DIFFICULTY, SKILLS } from '../constants/_index.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from '../enrichers/helpers.js';

function enrichTest(match, options) {
    let data = _getEnrichedOptions(match, options);
    // Don't enrich when invalid skill is provided.
    if (data.skill && !(data.skill in SKILLS)) return false;
    // Set TN by difficulty
    if (data.tn in DIFFICULTY) data.tn = DIFFICULTY[data.tn];
    if (!data.characteristic) data.characteristic = SKILLS[data.skill].default;

    let linkText = game.i18n.format('system.rolls.test.button', {
        tn: data.tn ? `TN ${data.tn} ` : '',
        characteristic: data.characteristic ? `${game.i18n.localize(CHARACTERISTICS[data.characteristic].label)}-` : '',
        skill: game.i18n.localize(SKILLS[data.skill].label),
        subskill: ['knowledge', 'craft'].includes(data.skill) && data.subskill ? ` (${data.subskill})` : '',
    });
    let link = createRollLink('test', linkText, '', data, true);

    return link;
}

async function rollTest(event) {
    const target = event.target.closest('.roll-link.roll-test');
    const data = await getRollContextData(target.dataset);

    if (!data.actor) return ui.notifications.error('No valid actor selected');
    data.actor.rollTest(data);
}

function postTestToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }
    options = `${options}|replaceCharacteristic=false`;
    let rollMessage = `@Test[${options}]`;
    ChatMessage.create({ content: rollMessage });
}

export { enrichTest, postTestToChat, rollTest };
