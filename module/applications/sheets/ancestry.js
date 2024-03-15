import { BaseItemSheet } from './base-item.js';

export class AncestrySheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['mcdmrpg', 'sheet', 'item', 'ancestry'],
        position: {
            width: 400,
            height: 540,
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, AncestrySheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/mcdmrpg/templates/documents/partials/item-header.hbs',
            },
            size: {
                id: 'size',
                template: 'systems/mcdmrpg/templates/documents/ancestry/ancestry-size.hbs',
            },
            details: {
                id: 'details',
                template: 'systems/mcdmrpg/templates/documents/ancestry/ancestry-details.hbs',
            },
            description: {
                id: 'description',
                template: 'systems/mcdmrpg/templates/documents/ancestry/ancestry-description.hbs',
            },
        },
        { inplace: false }
    );
}
