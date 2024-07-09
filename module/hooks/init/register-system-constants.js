import { Knockback } from '../../actions/knockback.js';
import { SKILLS } from '../../constants/skills.js';

export function registerSystemConstants() {
    const formattedCustomSkills = {
        crafting: {},
        exploration: {},
        interpersonal: {},
        intrigue: {},
        lore: {},
    };
    const customSkills = game.settings.get('mcdmrpg', 'customSkills');
    for (const skill of customSkills) {
        console.log(skill);
        formattedCustomSkills[skill.category][skill.name.slugify()] = {
            label: skill.name,
            default: skill.characteristic,
            isCustom: true,
        };
    }

    console.log(formattedCustomSkills);
    game.mcdmrpg = {
        actions: {
            knockback: Knockback.do,
        },
        skills: foundry.utils.mergeObject(SKILLS, formattedCustomSkills),
    };

    console.log(game.mcdmrpg.skills);
}
