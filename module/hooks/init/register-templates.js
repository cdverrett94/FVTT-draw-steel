export function registerTemplates() {
    // Load templates
    const templatePaths = [
        // Base
        'systems/mcdmrpg/module/documents/actors/base/sheet/partials/abilities.hbs',
        'systems/mcdmrpg/module/documents/actors/base/sheet/partials/abilities-filter.hbs',

        // Heroes
        'systems/mcdmrpg/module/documents/actors/hero/sheet/partials/skills.hbs',
        'systems/mcdmrpg/module/documents/actors/hero/sheet/partials/sidebar.hbs',
        'systems/mcdmrpg/module/documents/actors/hero/sheet/partials/header.hbs',
        'systems/mcdmrpg/module/documents/actors/hero/sheet/partials/effects.hbs',
    ];
    loadTemplates(templatePaths);
}
