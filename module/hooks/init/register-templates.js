export function registerTemplates() {
    // Load templates
    const templatePaths = [
        // Partials
        'systems/mcdmrpg/templates/documents/partials/abilities.hbs',
        'systems/mcdmrpg/templates/documents/partials/abilities-filter.hbs',
        'systems/mcdmrpg/templates/documents/partials/item-header.hbs',

        // Heroes
        'systems/mcdmrpg/templates/documents/hero/skills.hbs',
        'systems/mcdmrpg/templates/documents/hero/skill.hbs',
        'systems/mcdmrpg/templates/documents/hero/sidebar.hbs',
        'systems/mcdmrpg/templates/documents/hero/header.hbs',
        'systems/mcdmrpg/templates/documents/hero/effects.hbs',

        // Ancestry
        'systems/mcdmrpg/templates/documents/ancestry/ancestry-size.hbs',
        'systems/mcdmrpg/templates/documents/ancestry/ancestry-details.hbs',
        'systems/mcdmrpg/templates/documents/ancestry/ancestry-description.hbs',

        //Class
        'systems/mcdmrpg/templates/documents/class/class-resources.hbs',
        'systems/mcdmrpg/templates/documents/class/class-details.hbs',
    ];
    loadTemplates(templatePaths);
}
