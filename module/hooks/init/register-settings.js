import { CustomSkillsSettings } from '../../applications/_index.js';

export function registerSettings() {
    game.settings.registerMenu('draw-steel', 'customSkillsMenu', {
        name: 'Custom Skills',
        label: 'Custom Skills Setup',
        hint: 'A submenu to set up custom skills for your game. Upon saving, your game will reload',
        config: true,
        scope: 'world',
        icon: 'fas fa-bars',
        type: CustomSkillsSettings,
    });

    game.settings.register('draw-steel', 'customSkills', {
        name: 'Custom Skills',
        hint: 'custome skills config',
        config: false,
        scope: 'world',
        type: Array,
        onChange: () => {
            foundry.utils.debouncedReload();
        },
    });
}
