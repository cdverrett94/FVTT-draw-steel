import { registerCustomEnrichers } from './module/enrichers.js';
import { registerCustomHandlebarHelpers } from './module/hooks/init/register-custom-handlebar-helpers.js';
import { registerDataModels } from './module/hooks/init/register-data-models.js';
import { registerDocumentSheets } from './module/hooks/init/register-document-sheets.js';
import { registerRolls } from './module/hooks/init/register-rolls.js';
import { registerStatusEffects } from './module/hooks/init/register-status-effects.js';
import { registerTemplates } from './module/hooks/init/register-templates.js';

Hooks.on('init', () => {
    CONFIG.ActiveEffect.legacyTransferral = false;

    //set System Data models
    registerDataModels();

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
});

Hooks.on('ready', async () => {
    // game.actors.contents.find((actor) => actor.type === 'monster').sheet.render(true);
    // game.actors.contents.find((actor) => actor.type === 'hero').sheet.render(true);
    // game.items.contents.find((item) => item.type === 'class').sheet.render(true);
    // game.items.contents.find((item) => item.type === 'condition').sheet.render(true);
});
