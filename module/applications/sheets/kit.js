export class KitSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'kit'],
            template: `/systems/mcdmrpg/templates/documents/items/kit/kit-sheet.hbs`,
            tabs: [
                /*{
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },*/
            ],
            scrollY: ['.tabbed-content'],
            width: 400,
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
}
