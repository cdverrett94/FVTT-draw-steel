import { BaseItemSheet } from './base-item.js';

export class FeatureSheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['ancestry'],
        position: {
            width: 500,
            height: 'auto',
        },
        actions: {},
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, FeatureSheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            details: {
                id: 'details',
                template: 'systems/mcdmrpg/templates/documents/feature/feature-description.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        return context;
    }
}
