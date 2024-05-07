import { CHARACTERISTICS } from '../constants/characteristics.js';
import { SKILLS } from '../constants/skills.js';
import { _getEnrichedOptions, createRollLink, getRollContextData } from './helpers.js';

async function enrichTest(match, options) {
    let data = await _getEnrichedOptions(match, options);

    if (!data.skill) return false;
    let skillCategory;
    Object.entries(SKILLS).some((entry) => {
        const [category, skills] = entry;
        if (data.skill in skills) {
            skillCategory = category;
            return true;
        }
    });
    let label = skillCategory ? game.i18n.localize(`system.skills.${skillCategory}.${data.skill}.label`) : capitalize(data.skill);
    if (data.characteristic && data.characteristic in CHARACTERISTICS) {
        const localizedCharacteristic = game.i18n.localize(`system.characteristics.${data.characteristic}.label`);
        label = `${localizedCharacteristic}-${label}`;
    }
    let link = createRollLink({
        enrichType: 'test',
        label,
        data,
        postToChat: false,
    });

    return link;
}

async function rollTest(event) {
    const eventTarget = event.target.closest('.roll-link.roll-test');
    let data = await getRollContextData(eventTarget.dataset);

    if (!data.actor) return ui.notifications.error('No valid actor selected');
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
