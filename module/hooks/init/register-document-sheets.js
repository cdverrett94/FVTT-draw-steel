import {
    AbilitySheet,
    AncestrySheet,
    CareerSheet,
    ClassSheet,
    CultureSheet,
    FeatureSheet,
    HeroSheet,
    KitSheet,
    MonsterSheet,
} from '../../applications/_index.js';

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

    Items.registerSheet('mcdmrpg', FeatureSheet, {
        types: ['feature'],
        makeDefault: true,
        label: 'Feature Sheet',
    });
    Items.registerSheet('mcdmrpg', CultureSheet, {
        types: ['culture'],
        makeDefault: true,
        label: 'Culture Sheet',
    });
    Items.registerSheet('mcdmrpg', CareerSheet, {
        types: ['career'],
        makeDefault: true,
        label: 'Career Sheet',
    });
}
