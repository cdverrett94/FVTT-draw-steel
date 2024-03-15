const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheet } = foundry.applications.sheets;
export class BaseItemSheet extends HandlebarsApplicationMixin(ItemSheet) {
    static additionalOptions = {
        window: {
            icon: 'fas fa-suitcase',
            positioned: true,
        },
        classes: ['mcdmrpg', 'sheet', 'item'],
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
        },
    };

    get item() {
        return this.document;
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseItemSheet.additionalOptions, { inplace: false });

    static PARTS = {};

    async _prepareContext(options) {
        return {
            item: this.item,
            source: this.item.toObject(),
            fields: this.item.system.schema.fields,
        };
    }
}
