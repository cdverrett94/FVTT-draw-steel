import { ABILITIES } from '../../constants/abilities.js';
import { CHARACTERISTICS } from '../../constants/characteristics.js';
import { BaseItemSheet } from './base-item.js';

export class AbilitySheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['ability'],
        position: {
            width: 800,
            height: 'auto',
        },
        actions: {
            addTierEffect: this.addTierEffect,
            deleteTierEffect: this.deleteTierEffect,
            toggleTierVisibility: this.toggleTierVisibility,
        },
    };

    tierVisibile = {
        one: false,
        two: false,
        three: false,
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
                template: 'systems/mcdmrpg/templates/documents/partials/item-effects.hbs',
            },
        },
        { inplace: false }
    );

    mainTabs = foundry.utils.mergeObject(this.mainTabs, {
        power: {
            label: 'system.sheets.items.ability.tabs.power',
            priority: 2,
        },
    });

    async _prepareContext(options) {
        const context = foundry.utils.mergeObject(
            await super._prepareContext(options),
            {
                constants: {
                    keywords: ABILITIES.KEYWORDS,
                    tierVisibile: this.tierVisibile,
                    characteristics: CHARACTERISTICS,
                },
            },
            { inplace: false }
        );

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

    static async addTierEffect(event, target) {
        const { tier } = target.dataset;
        const updateData = foundry.utils.duplicate(this.item.system.power.tiers[tier]);

        updateData.push({
            type: 'damage',
        });

        await this.item.update({ [`system.power.tiers.${tier}`]: updateData });
    }

    static async deleteTierEffect(event, target) {
        const { tier, effectIndex } = target.dataset;
        const updateData = foundry.utils.duplicate(this.item.system.power.tiers[tier]);

        updateData.splice(effectIndex, 1);

        await this.item.update({ [`system.power.tiers.${tier}`]: updateData });
    }

    static toggleTierVisibility(event, target) {
        const { tier } = target.dataset;
        const parent = this.element.querySelector(`.power-tier.tier-${tier}`);
        const toggleButton = parent.querySelector('.tier-label span i');
        const tierEffects = parent.querySelector('.tier-effects');
        const currentlyHidden = tierEffects.classList.contains('hidden') ? true : false;

        const oldButtonClass = currentlyHidden ? 'fa-chevron-down' : 'fa-chevron-up';
        const newButtonClass = currentlyHidden ? 'fa-chevron-up' : 'fa-chevron-down';
        toggleButton.classList.remove(oldButtonClass);
        toggleButton.classList.add(newButtonClass);

        tierEffects.classList.toggle('hidden');
        this.tierVisibile[tier] = currentlyHidden ? true : false;
    }
}
