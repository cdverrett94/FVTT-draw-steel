import { BaseItemSheet } from './base-item.js';

export class AbilitySheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['mcdmrpg', 'sheet', 'item', 'ability'],
        position: {
            width: 600,
            height: 1000,
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, AbilitySheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/mcdmrpg/templates/documents/partials/item-header.hbs',
            },
            keywords: {
                id: 'size',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-keywords.hbs',
            },
            properties: {
                id: 'properties',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-properties.hbs',
            },

            damage: {
                id: 'damage',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-damage.hbs',
            },
            effect: {
                id: 'effect',
                template: 'systems/mcdmrpg/templates/documents/ability/ability-effect.hbs',
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
