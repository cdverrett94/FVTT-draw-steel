import { BaseItemSheet } from './base-item.js';

export class AbilitySheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['ability'],
        position: {
            width: 600,
            height: 'auto',
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, AbilitySheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            keywords: {
                id: 'size',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-keywords.hbs',
            },
            properties: {
                id: 'properties',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-properties.hbs',
            },

            tiers: {
                id: 'tiers',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-tiers.hbs',
            },
            effect: {
                id: 'effect',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-effect.hbs',
            },
            rules: {
                id: 'rules',
                template: 'systems/mcdmrpg/templates/documents/partials/item-rules.hbs',
            },
        },
        { inplace: false }
    );

    _prepareSubmitData(formData) {
        formData = super._prepareSubmitData(formData);
        formData.system.keywords = formData.system.keywords?.filter((keyword) => keyword);

        return formData;
    }
}
