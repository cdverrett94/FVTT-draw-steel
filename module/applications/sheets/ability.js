import { abilityTimes, abilityTypes, characteristics, damageTypes, keywords } from '../../constants.js';

export class AbilitySheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'ability'],
            template: `/systems/mcdmrpg/templates/documents/items/ability/ability-sheet.hbs`,
            tabs: [
                /*{
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },*/
            ],
            scrollY: [
                /*'.equipment-list', '.skills-container'*/
            ],
            height: 'auto',
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = {
            name: this.item.name,
            img: this.item.img,
            ...this.item.system,
            keywordsList: keywords,
            abilityTypes: Object.entries(abilityTypes),
            characteristics,
            damageTypes,
            abilityTimes,
        };
        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];
    }

    _getSubmitData(updateData = {}) {
        let submitData = super._getSubmitData(updateData);
        submitData['system.keywords'] = submitData['system.keywords']?.filter((keyword) => keyword);

        return submitData;
    }
}
