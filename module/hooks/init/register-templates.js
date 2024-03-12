export function registerTemplates() {
    // Load templates
    const templatePaths = [
        // Base
        'systems/mcdmrpg/templates/documents/actors/base/partials/abilities.hbs',
        'systems/mcdmrpg/templates/documents/actors/base/partials/abilities-filter.hbs',
        'systems/mcdmrpg/templates/documents/partials/item-header.hbs',

        // Heroes
        'systems/mcdmrpg/templates/documents/actors/hero/partials/skills.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/skill.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/sidebar.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/header.hbs',
        'systems/mcdmrpg/templates/documents/actors/hero/partials/effects.hbs',

        // Ancestry
        'systems/mcdmrpg/templates/documents/ancestry/ancestry-size.hbs',
        'systems/mcdmrpg/templates/documents/ancestry/ancestry-details.hbs',
        'systems/mcdmrpg/templates/documents/ancestry/ancestry-description.hbs',
    ];
    loadTemplates(templatePaths);
}
