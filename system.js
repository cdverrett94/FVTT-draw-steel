import {
    registerCustomEnrichers,
    registerCustomHandlebarHelpers,
    registerDamageTargetListners,
    registerDataModels,
    registerDocumentClasses,
    registerDocumentSheets,
    registerRolls,
    registerStatusEffects,
    registerTemplates,
    setCSSVariables,
} from './module/hooks/_index.js';

Hooks.on('init', () => {
    CONFIG.ActiveEffect.legacyTransferral = false;

    //Register System Data Models
    registerDataModels();

    // Register Document Classes
    registerDocumentClasses();

    // Load templates
    registerTemplates();

    // Register Actor Sheets
    registerDocumentSheets();

    // Add Custom Handlebars helper
    registerCustomHandlebarHelpers();

    // Register Enrichers
    registerCustomEnrichers();

    // Register System Dice Rolls
    registerRolls();

    // Register System Conditions
    registerStatusEffects();

    // Set CSS Variables
    setCSSVariables();
});

Hooks.on('ready', async () => {
    // game.actors.contents.find((actor) => actor.type === 'hero').sheet.render(true);
    // game.items.contents.find((item) => item.type === 'class').sheet.render(true);
});

Hooks.on('renderChatMessage', async (document, $html) => {
    const html = $html[0];

    registerDamageTargetListners(document, html);
});
