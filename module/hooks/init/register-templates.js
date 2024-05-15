export async function registerTemplates() {
    // Load templates
    const templatePaths = [
        // Partials
        'systems/mcdmrpg/templates/documents/partials/actor-abilities-container.hbs',
        'systems/mcdmrpg/templates/documents/partials/actor-abilities-filter.hbs',
        'systems/mcdmrpg/templates/documents/partials/actor-abilities.hbs',
        'systems/mcdmrpg/templates/documents/partials/actor-characteristics.hbs',
        'systems/mcdmrpg/templates/combat/partials/combatant.hbs',

        // Monsters
        'systems/mcdmrpg/templates/documents/monster/header.hbs',
        'systems/mcdmrpg/templates/documents/monster/skills.hbs',

        // Chat Messages
        'systems/mcdmrpg/templates/chat-messages/damage-message.hbs',
        'systems/mcdmrpg/templates/chat-messages/ability-message.hbs',
        'systems/mcdmrpg/templates/chat-messages/partials/dice-total.hbs',

        // Rolls
        'systems/mcdmrpg/templates/rolls/power-roll/partials/formula-button.hbs',
    ];
    await loadTemplates(templatePaths);
}
