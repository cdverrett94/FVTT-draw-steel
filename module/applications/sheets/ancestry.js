import { BaseItemSheet } from './base-item.js';

export class AncestrySheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['ancestry'],
        position: {
            width: 500,
            height: 'auto',
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, AncestrySheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            size: {
                id: 'size',
                template: 'systems/draw-steel/templates/documents/ancestry/ancestry-size.hbs',
            },
            details: {
                id: 'details',
                template: 'systems/draw-steel/templates/documents/ancestry/ancestry-details.hbs',
            },
            description: {
                id: 'description',
                template: 'systems/draw-steel/templates/documents/ancestry/ancestry-description.hbs',
            },
        },
        { inplace: false }
    );
}
