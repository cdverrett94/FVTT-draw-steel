import { KITS } from '../../constants/kits.js';
import { BaseItemSheet } from './base-item.js';
export class KitSheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['kit'],
        position: {
            width: 500,
            height: 'auto',
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, KitSheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            details: {
                id: 'details',
                template: '/systems/mcdmrpg/templates/documents/kit/kit-details.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.constants.kits = KITS;

        return context;
    }
}
