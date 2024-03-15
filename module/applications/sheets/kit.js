import { BaseItemSheet } from './base-item.js';
export class KitSheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['kit'],
        position: {
            width: 400,
            height: 585,
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, KitSheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/mcdmrpg/templates/documents/partials/item-header.hbs',
            },
            details: {
                id: 'details',
                template: '/systems/mcdmrpg/templates/documents/kit/kit-details.hbs',
            },
        },
        { inplace: false }
    );
}
