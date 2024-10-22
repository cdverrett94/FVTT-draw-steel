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
    Actors.registerSheet('draw-steel', HeroSheet, {
        types: ['hero'],
        makeDefault: true,
        label: 'Hero Sheet',
    });
    Actors.registerSheet('draw-steel', MonsterSheet, {
        types: ['monster'],
        makeDefault: true,
        label: 'Monster Sheet',
    });

    // Register Item Sheets
    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet('draw-steel', AbilitySheet, {
        types: ['ability'],
        makeDefault: true,
        label: 'Ability Sheet',
    });
    Items.registerSheet('draw-steel', AncestrySheet, {
        types: ['ancestry'],
        makeDefault: true,
        label: 'Ancestry Sheet',
    });
    Items.registerSheet('draw-steel', ClassSheet, {
        types: ['class'],
        makeDefault: true,
        label: 'Class Sheet',
    });
    Items.registerSheet('draw-steel', KitSheet, {
        types: ['kit'],
        makeDefault: true,
        label: 'Kit Sheet',
    });

    Items.registerSheet('draw-steel', FeatureSheet, {
        types: ['feature'],
        makeDefault: true,
        label: 'Feature Sheet',
    });
    Items.registerSheet('draw-steel', CultureSheet, {
        types: ['culture'],
        makeDefault: true,
        label: 'Culture Sheet',
    });
    Items.registerSheet('draw-steel', CareerSheet, {
        types: ['career'],
        makeDefault: true,
        label: 'Career Sheet',
    });
}
