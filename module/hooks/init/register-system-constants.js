import { Knockback } from '../../actions/knockback.js';
import { SKILLS } from '../../constants/skills.js';
import { knockbackMacroPrompt } from '../../macros/knockback-macro.js';

export function registerSystemConstants() {
    const formattedCustomSkills = {
        crafting: {},
        exploration: {},
        interpersonal: {},
        intrigue: {},
        lore: {},
    };
    const customSkills = game.settings.get('draw-steel', 'customSkills') ?? [];
    for (const skill of customSkills) {
        formattedCustomSkills[skill.category][skill.name.slugify()] = {
            label: skill.name,
            default: skill.characteristic,
            isCustom: true,
        };
    }
    game['draw-steel'] = {
        actions: {
            knockback: Knockback.do,
        },
        macros: {
            knockback: knockbackMacroPrompt,
        },
        skills: foundry.utils.mergeObject(SKILLS, formattedCustomSkills),
    };
}
