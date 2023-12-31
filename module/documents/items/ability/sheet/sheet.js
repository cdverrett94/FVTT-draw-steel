import { abilityTypes, keywords } from '../../../../constants.js';

export class AbilitySheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'ability'],
            template: `/systems/mcdmrpg/module/documents/items/ability/sheet/ability-sheet.hbs`,
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
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = {
            name: this.item.name,
            img: this.item.img,
            ...this.item.system,
            keywordsList: keywords,
            abilityTypes,
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
