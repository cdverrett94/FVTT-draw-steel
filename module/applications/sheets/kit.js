import { BaseItemSheet } from './base-item.js';

export class KitSheet extends BaseItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'kit'],
            template: `/systems/mcdmrpg/templates/documents/kit/kit-sheet.hbs`,
            width: 400,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }
}
