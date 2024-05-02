import { ABILITIES } from '../../constants/abilities.js';
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

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.constants = {
            keywords: ABILITIES.KEYWORDS,
        };

        return context;
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        if (partId === 'keywords') {
            htmlElement.querySelectorAll('multi-checkbox').forEach((element) => {
                element.addEventListener('change', (event) => {
                    this.element.requestSubmit();
                });
            });
        }
    }

    _prepareSubmitData(event, form, formData) {
        formData = super._prepareSubmitData(event, form, formData);
        formData.system.keywords.sort();

        return formData;
    }
}
