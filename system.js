import { MCDMCombatTracker } from './module/applications/sidebar/combat-tracker.js';
import {
    addButtonsToTargets,
    registerCustomEnrichers,
    registerCustomHandlebarHelpers,
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

    CONFIG.ui.combat = MCDMCombatTracker;

    CONFIG.Actor.trackableAttributes = {
        hero: {
            value: ['turns'],
            bar: ['hp'],
        },
        monster: {
            value: ['turns'],
            bar: ['hp'],
        },
    };
});

Hooks.on('ready', async () => {
    // game.actors.contents.find((actor) => actor.type === 'hero').sheet.render(true);
    // game.items.contents.find((item) => item.type === 'class').sheet.render(true);
    game.socket.on('system.mcdmrpg', async (response) => {
        if (response.action === 'knockback-request') {
            console.log(response); // Other clients only react to the broadcast
            if (game.user !== game.users.activeGM) return false;

            let approved = !!Math.round(Math.random());
            if (!approved) response.payload.approved = false;
            else {
                let token = await fromUuid(response.payload.token);
                await token.update({ x: response.payload.position.x, y: response.payload.position.y });
                response.payload.approved = true;
            }

            response.action = 'knockback-response';
            game.socket.emit('system.mcdmrpg', response);
        }
    });
});

Hooks.on('renderChatMessage', async (document, $html) => {
    const html = $html[0];
    addButtonsToTargets(document, html);
});
