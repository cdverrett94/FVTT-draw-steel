import { BaseItemSheet } from './base-item.js';

export class AncestrySheet extends BaseItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'ancestry'],
            template: `/systems/mcdmrpg/templates/documents/ancestry/ancestry-sheet.hbs`,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }
}
