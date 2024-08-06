import { Knockback } from './module/actions/knockback.js';
import { MCDMCombatTracker } from './module/applications/sheets/sidebar/combat-tracker.js';
import {
    addButtonsToTargets,
    registerCustomEnrichers,
    registerCustomHandlebarHelpers,
    registerDataModels,
    registerDocumentClasses,
    registerDocumentSheets,
    registerRolls,
    registerSettings,
    registerStatusEffects,
    registerSystemConstants,
    registerTemplates,
    setCSSVariables,
} from './module/hooks/_index.js';
import { createResistanceRollButton } from './module/hooks/renderChatMessage/roll-resistance-button.js';

Hooks.on('init', () => {
    CONFIG.ActiveEffect.legacyTransferral = false;

    registerSettings();
    registerSystemConstants();

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

    CONFIG.ui.combat = MCDMCombatTracker;

    CONFIG.Actor.trackableAttributes = {
        hero: {
            value: ['turns'],
            bar: ['stamina'],
        },
        monster: {
            value: ['turns'],
            bar: ['stamina'],
        },
    };
});

Hooks.on('ready', async () => {
    game.actors.contents.find((actor) => actor.type === 'monster').sheet.render(true);
    // game.items.contents.find((item) => item.type === 'class').sheet.render(true);
    Knockback.registerGMSocket();
});

Hooks.on('renderChatMessage', async (document, $html) => {
    const html = $html[0];
    addButtonsToTargets(document, html);
    createResistanceRollButton(document, html);
});
