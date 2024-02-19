import { MCDMActorProxy } from './module/documents/actors/actor-proxy.js';
import { HeroData } from './module/documents/actors/hero/data-model.js';
import { HeroSheet } from './module/documents/actors/hero/sheet/sheet.js';
import { MonsterData } from './module/documents/actors/monster/data-model.js';
import { MonsterSheet } from './module/documents/actors/monster/sheet/sheet.js';
import { AbilityData } from './module/documents/items/ability/data-model.js';
import { AbilitySheet } from './module/documents/items/ability/sheet/sheet.js';
import { AncestryData } from './module/documents/items/ancestry/data-model.js';
import { AncestrySheet } from './module/documents/items/ancestry/sheet/sheet.js';
import { ClassData } from './module/documents/items/class/data-model.js';
import { ClassSheet } from './module/documents/items/class/sheet/sheet.js';
import { MCDMItemProxy } from './module/documents/items/item-proxy.js';
import { KitData } from './module/documents/items/kit/data-model.js';
import { KitSheet } from './module/documents/items/kit/sheet/sheet.js';
import { DamageRoll } from './module/documents/rolls/damage/damage-roll.js';
import { ResistanceRoll } from './module/documents/rolls/resistance/resistance-roll.js';
import { TestRoll } from './module/documents/rolls/test/test-roll.js';
import { registerCustomEnrichers } from './module/enrichers.js';

Hooks.on('init', () => {
    console.log('hi');
    // Set System Actor Data Models
    CONFIG.Actor.dataModels.hero = HeroData;
    CONFIG.Actor.dataModels.monster = MonsterData;

    // Set System Item Data Models
    CONFIG.Item.dataModels.ability = AbilityData;
    CONFIG.Item.dataModels.kit = KitData;
    CONFIG.Item.dataModels.ancestry = AncestryData;
    CONFIG.Item.dataModels.class = ClassData;

    // Set System Document Classes
    CONFIG.Actor.documentClass = MCDMActorProxy;
    CONFIG.Item.documentClass = MCDMItemProxy;

    // Load templates
    const templatePaths = [
        // Base
        'systems/mcdmrpg/module/documents/actors/base/sheet/partials/abilities.hbs',
        'systems/mcdmrpg/module/documents/actors/base/sheet/partials/abilities-filter.hbs',

        // Heroes
        'systems/mcdmrpg/module/documents/actors/hero/sheet/partials/skills.hbs',
        'systems/mcdmrpg/module/documents/actors/hero/sheet/partials/sidebar.hbs',
        'systems/mcdmrpg/module/documents/actors/hero/sheet/partials/header.hbs',
    ];
    loadTemplates(templatePaths);

    // Register Actor Sheets
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('mcdmrpg', HeroSheet, {
        types: ['hero'],
        makeDefault: true,
        label: 'Hero Sheet',
    });
    Actors.registerSheet('mcdmrpg', MonsterSheet, {
        types: ['monster'],
        makeDefault: true,
        label: 'Monster Sheet',
    });

    // Register Item Sheets
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
    Items.registerSheet('mcdmrpg', AncestrySheet, {
        types: ['ancestry'],
        makeDefault: true,
        label: 'Ancestry Sheet',
    });

    // Add Custom Handlebars helper
    Handlebars.registerHelper('includes', function (array, value) {
        return array.includes(value);
    });

    // Register Enrichers
    registerCustomEnrichers();

    // Register System Dice Rolls
    CONFIG.Dice.rolls.push(DamageRoll, ResistanceRoll, TestRoll);

    // Register System Conditions
    CONFIG.statusEffects = [
        {
            icon: 'icons/magic/death/grave-tombstone-glow-tan.webp',
            id: 'dead',
            name: 'conditions.dead',
        },
        {
            icon: 'icons/skills/wounds/blood-drip-droplet-red.webp',
            id: 'bloodied',
            name: 'conditions.bloodied',
        },
        {
            icon: 'icons/magic/unholy/strike-body-life-soul-green.webp',
            id: 'dazed',
            name: 'conditions.dazed',
        },
        {
            icon: 'icons/magic/unholy/silhouette-robe-evil-power.webp',
            id: 'frightened',
            name: 'conditions.frightened',
        },

        {
            icon: 'icons/skills/melee/unarmed-punch-fist-yellow-red.webp',
            id: 'grappled',
            name: 'conditions.grappled',
        },
        {
            icon: 'icons/magic/life/ankh-gold-blue.webp',
            id: 'ongoing-damage',
            name: 'conditions.ongoing-damage',
        },
        {
            icon: 'icons/magic/control/silhouette-fall-slip-prone.webp',
            id: 'prone',
            name: 'conditions.prone',
        },
        {
            icon: 'icons/magic/control/debuff-chains-shackle-movement-red.webp',
            id: 'restrained',
            name: 'conditions.restrained',
        },
        {
            icon: 'icons/skills/movement/feet-winged-boots-brown.webp',
            id: 'slowed',
            name: 'conditions.slowed',
        },
        {
            icon: 'icons/magic/control/fear-fright-white.webp',
            id: 'surprised',
            name: 'conditions.surprised',
        },
        {
            icon: 'icons/magic/control/energy-stream-link-spiral-white.webp',
            id: 'taunted',
            name: 'conditions.taunted',
        },
        {
            icon: 'icons/magic/control/debuff-energy-snare-blue.webp',
            id: 'unbalanced',
            name: 'conditions.unbalanced',
        },
        {
            icon: 'icons/magic/control/sleep-bubble-purple.webp',
            id: 'unconscious',
            name: 'conditions.unconscious',
        },
        {
            icon: 'icons/magic/death/hand-withered-gray.webp',
            id: 'weakened',
            name: 'conditions.weakened',
        },
    ];
});

Hooks.on('ready', async () => {
    game.actors.contents.find((actor) => actor.type === 'monster').sheet.render(true);
    // game.actors.contents.find((actor) => actor.type === 'hero').sheet.render(true);
    // game.items.contents.find((item) => item.type === 'class').sheet.render(true);
});
