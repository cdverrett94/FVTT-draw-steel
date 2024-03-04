export function registerTemplates() {
    // Load templates
    const templatePaths = [
        // Base
        'systems/mcdmrpg/templates/documents/actors/base/partials/abilities.hbs',
        'systems/mcdmrpg/templates/documents/actors/base/partials/abilities-filter.hbs',

        // Heroes
        'systems/mcdmrpg/templates/documents/actors/hero/partials/skills.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/skill.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/sidebar.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/header.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/effects.hbs',
    ];
    loadTemplates(templatePaths);
}
