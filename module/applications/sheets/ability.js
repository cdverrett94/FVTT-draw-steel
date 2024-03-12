import { BaseItemSheet } from './base-item.js';

export class AbilitySheet extends BaseItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'ability'],
            template: `/systems/mcdmrpg/templates/documents/ability/ability-sheet.hbs`,
            height: 'auto',
            width: 500,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    _getSubmitData(updateData = {}) {
        let submitData = super._getSubmitData(updateData);
        submitData['system.keywords'] = submitData['system.keywords']?.filter((keyword) => keyword);

        return submitData;
    }
}
