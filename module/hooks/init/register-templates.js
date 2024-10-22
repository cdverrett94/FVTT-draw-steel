export async function registerTemplates() {
    // Load templates
    const templatePaths = [
        // Partials
        'systems/draw-steel/templates/documents/actor/partials/abilities/abilities-container.hbs',
        'systems/draw-steel/templates/documents/actor/partials/abilities/abilities-filter.hbs',
        'systems/draw-steel/templates/documents/actor/partials/abilities/abilities.hbs',
        'systems/draw-steel/templates/documents/actor/partials/characteristics.hbs',
        'systems/draw-steel/templates/combat/partials/combatant.hbs',
        'systems/draw-steel/templates/documents/career/career-info.hbs',
        'systems/draw-steel/templates/documents/career/career-incidents.hbs',
        'systems/draw-steel/templates/documents/career/career-skill-choices.hbs',

        // Heroes
        'systems/draw-steel/templates/documents/actor/partials/tabs.hbs',
        'systems/draw-steel/templates/documents/actor/partials/skills/skills-view.hbs',
        'systems/draw-steel/templates/documents/actor/partials/skills/skills-edit.hbs',
        'systems/draw-steel/templates/documents/actor/hero/sub-items.hbs',

        // Monsters
        'systems/draw-steel/templates/documents/actor/monster/header-edit.hbs',
        'systems/draw-steel/templates/documents/actor/monster/header-view.hbs',

        // Chat Messages
        'systems/draw-steel/templates/chat-messages/damage-message.hbs',
        'systems/draw-steel/templates/chat-messages/ability-roll.hbs',
        'systems/draw-steel/templates/chat-messages/partials/dice-total.hbs',

        // Rolls
        'systems/draw-steel/templates/rolls/power-roll/partials/formula-button.hbs',
    ];
    await loadTemplates(templatePaths);
}
