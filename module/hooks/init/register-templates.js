export function registerTemplates() {
  // Load templates
  const templatePaths = [
    // Partials
    "systems/mcdmrpg/templates/documents/partials/actor-abilities-container.hbs",
    "systems/mcdmrpg/templates/documents/partials/actor-abilities-filter.hbs",
    "systems/mcdmrpg/templates/documents/partials/actor-abilities.hbs",
    "systems/mcdmrpg/templates/documents/partials/actor-characteristics.hbs",
    "systems/mcdmrpg/templates/combat/partials/combatant.hbs",

    // Heroes
    "systems/mcdmrpg/templates/documents/hero/skills.hbs",
    "systems/mcdmrpg/templates/documents/hero/skill.hbs",
    "systems/mcdmrpg/templates/documents/hero/sidebar.hbs",
    "systems/mcdmrpg/templates/documents/hero/header.hbs",
    "systems/mcdmrpg/templates/documents/hero/effects.hbs",

    // Monsters
    "systems/mcdmrpg/templates/documents/monster/header.hbs",
    "systems/mcdmrpg/templates/documents/monster/skills.hbs",

    // Chat Messages
    "systems/mcdmrpg/templates/chat-messages/damage-message.hbs",
  ];
  loadTemplates(templatePaths);
}
