export async function registerTemplates() {
    // Load templates
    const templatePaths = [
        // Partials
        'systems/mcdmrpg/templates/documents/actor/partials/abilities/abilities-container.hbs',
        'systems/mcdmrpg/templates/documents/actor/partials/abilities/abilities-filter.hbs',
        'systems/mcdmrpg/templates/documents/actor/partials/abilities/abilities.hbs',
        'systems/mcdmrpg/templates/documents/actor/partials/characteristics.hbs',
        'systems/mcdmrpg/templates/combat/partials/combatant.hbs',

        // Heroes
        'systems/mcdmrpg/templates/documents/actor/partials/tabs.hbs',
        'systems/mcdmrpg/templates/documents/actor/partials/skills/skills-view.hbs',
        'systems/mcdmrpg/templates/documents/actor/partials/skills/skills-edit.hbs',

        // Monsters
        'systems/mcdmrpg/templates/documents/actor/monster/header.hbs',

        // Chat Messages
        'systems/mcdmrpg/templates/chat-messages/damage-message.hbs',
        'systems/mcdmrpg/templates/chat-messages/ability-roll.hbs',
        'systems/mcdmrpg/templates/chat-messages/partials/dice-total.hbs',

        // Rolls
        'systems/mcdmrpg/templates/rolls/power-roll/partials/formula-button.hbs',
    ];
    await loadTemplates(templatePaths);
}
