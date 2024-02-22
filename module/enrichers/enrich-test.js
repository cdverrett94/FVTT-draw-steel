import { characteristics, skills, tnDifficulty } from '../constants.js';
import { TestRollDialog } from '../documents/rolls/test/roll-dialog/roll-dialog.js';
import { TestRoll } from '../documents/rolls/test/test-roll.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from '../enrichers.js';

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
    let { actor, baseFormula, banes, boons, characteristic, formula, skill, subskill, tn } = await getRollContextData(target.dataset);

    // set skill proficiency
    let proficient;
    if (['craft', 'knowledge'].includes(skill)) proficient = actor?.system.skills[skill].find((sub) => sub.subskill === subskill)?.proficient ?? false;
    else proficient = actor?.system.skills[skill].proficient;

    // set skill characteristic if there is none;
    if (!characteristic) {
        if (['craft', 'knowledge'].includes(skill)) characteristic = actor?.system.skills[skill].find((sub) => sub.subskill === subskill)?.characteristic;
        else characteristic = actor?.system.skills[skill].characteristic;
    }

    let context = {
        actor,
        baseFormula,
        banes,
        boons,
        characteristic,
        formula,
        proficient,
        skill,
        subskill,
        tn,
    };
    await new TestRollDialog(context).render(true);
}

function postTestToChat({ dataset }) {
    let options = '';
    for (const [key, value] of Object.entries(dataset)) {
        if (!['baseFormula', 'formula', 'actorId', 'replaceCharacteristic'].includes(key)) options = `${options}|${key}=${value}`;
    }
    options = `${options}|replaceCharacteristic=false`;
    let rollMessage = `@Test[${baseFormula}${options}]`;
    ChatMessage.create({ content: rollMessage });
}

export { enrichTest, postTestToChat, rollTest };
