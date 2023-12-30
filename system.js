import { MCDMActorProxy } from './module/documents/actors/actor-proxy.js';
import { HeroData } from './module/documents/actors/heroes/data-model.js';
import { HeroSheet } from './module/documents/actors/heroes/sheet/sheet.js';
import { AbilityData } from './module/documents/items/ability/data-model.js';
import { AbilitySheet } from './module/documents/items/ability/sheet/sheet.js';
import { ClassSheet } from './module/documents/items/class/sheet/sheet.js';
import { MCDMItemProxy } from './module/documents/items/item-proxy.js';
import { KitData } from './module/documents/items/kit/data-model.js';
import { KitSheet } from './module/documents/items/kit/sheet/sheet.js';
import { DamageRoll } from './module/documents/rolls/damage-roll.js';
import { registerCustomEnrichers } from './module/enrichers.js';

Hooks.on('init', () => {
    // Set module Data Models
    CONFIG.Actor.dataModels.hero = HeroData;
    CONFIG.Item.dataModels.ability = AbilityData;
    CONFIG.Item.dataModels.kit = KitData;

    // Set module Document Classes
    CONFIG.Actor.documentClass = MCDMActorProxy;
    CONFIG.Item.documentClass = MCDMItemProxy;

    // Load templates
    const templatePaths = [
        // Heroes
        'systems/mcdmrpg/module/documents/actors/heroes/sheet/partials/skills.html',
        'systems/mcdmrpg/module/documents/actors/heroes/sheet/partials/abilities.html',
        'systems/mcdmrpg/module/documents/actors/heroes/sheet/partials/sidebar.html',
        'systems/mcdmrpg/module/documents/actors/heroes/sheet/partials/header.html',
    ];
    loadTemplates(templatePaths);

    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('mcdmrpg', HeroSheet, {
        types: ['hero'],
        makeDefault: true,
        label: 'Hero Sheet',
    });

    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet('mcdmrpg', ClassSheet, {
        types: ['class'],
        makeDefault: true,
        label: 'Class Sheet',
    });
    Items.registerSheet('mcdmrpg', AbilitySheet, {
        types: ['ability'],
        makeDefault: true,
        label: 'Ability Sheet',
    });
    Items.registerSheet('mcdmrpg', KitSheet, {
        types: ['kit'],
        makeDefault: true,
        label: 'Kit Sheet',
    });

    Handlebars.registerHelper('includes', function (array, value) {
        return array.includes(value);
    });

    registerCustomEnrichers();

    CONFIG.Dice.rolls.push(DamageRoll);
});

Hooks.on('ready', async () => {
    game.actors.contents[0].sheet.render(true);
    // game.items.contents.find((item) => item.type === 'class').sheet.render(true);
});
