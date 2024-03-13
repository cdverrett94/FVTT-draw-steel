import { registerCustomEnrichers } from './module/enrichers/helpers.js';
import { registerCustomHandlebarHelpers } from './module/hooks/init/register-custom-handlebar-helpers.js';
import { registerDataModels } from './module/hooks/init/register-data-models.js';
import { registerDocumentClasses } from './module/hooks/init/register-document-classes.js';
import { registerDocumentSheets } from './module/hooks/init/register-document-sheets.js';
import { registerRolls } from './module/hooks/init/register-rolls.js';
import { registerStatusEffects } from './module/hooks/init/register-status-effects.js';
import { registerTemplates } from './module/hooks/init/register-templates.js';
import { setCSSVariables } from './module/hooks/init/setCSSVariables.js';
import { registerDamageTargetListners } from './module/hooks/renderChatMessage/add-damage-target-listeners.js';

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
