import { characteristics, skills, tnDifficulty } from '../constants.js';
import { TestRoll } from '../documents/rolls/test/test-roll.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from '../enrichers/helpers.js';

function enrichTest(match, options) {
    let data = _getEnrichedOptions(match, options);

    data.formula = TestRoll.constructFinalFormula(data.baseFormula, data);

    // Don't enrich when invalid skill is provided.
    if (!data.skill && !(data.skill in skills)) return false;

    // Set TN by difficulty
    if (data.tn in tnDifficulty) data.tn = tnDifficulty[data.tn];

    let linkText = game.i18n.format('mcdmrpg.rolls.test.button', {
        tn: data.tn ? `TN ${data.tn} ` : '',
        characteristic: data.characteristic ? `${game.i18n.localize(characteristics[data.characteristic].label)}-` : '',
        skill: game.i18n.localize(skills[data.skill].label),
        subskill: ['knowledge', 'craft'].includes(data.skill) && data.subskill ? ` (${data.subskill})` : '',
    });
    let link = createRollLink('test', linkText, data.formula, data, true);

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
