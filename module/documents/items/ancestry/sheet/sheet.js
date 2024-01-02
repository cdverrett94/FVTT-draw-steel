export class AncestrySheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'ancestry'],
            template: `/systems/mcdmrpg/module/documents/items/ancestry/sheet/ancestry-sheet.hbs`,
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
        };
        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];
    }

    _getSubmitData(updateData = {}) {
        updateData = super._getSubmitData(updateData);

        return updateData;
    }
}
