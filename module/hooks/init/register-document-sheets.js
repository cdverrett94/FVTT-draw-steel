import { HeroSheet } from '../../documents/actors/hero/sheet/sheet.js';
import { MonsterSheet } from '../../documents/actors/monster/sheet/sheet.js';
import { AbilitySheet } from '../../documents/items/ability/ability-sheet.js';
import { AncestrySheet } from '../../documents/items/ancestry/ancestry-sheet.js';
import { ClassSheet } from '../../documents/items/class/class-sheet.js';
import { KitSheet } from '../../documents/items/kit/kit-sheet.js';

export function registerDocumentSheets() {
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
    Items.registerSheet('mcdmrpg', AbilitySheet, {
        types: ['ability'],
        makeDefault: true,
        label: 'Ability Sheet',
    });
    Items.registerSheet('mcdmrpg', AncestrySheet, {
        types: ['ancestry'],
        makeDefault: true,
        label: 'Ancestry Sheet',
    });
    Items.registerSheet('mcdmrpg', ClassSheet, {
        types: ['class'],
        makeDefault: true,
        label: 'Class Sheet',
    });
    Items.registerSheet('mcdmrpg', KitSheet, {
        types: ['kit'],
        makeDefault: true,
        label: 'Kit Sheet',
    });
}
