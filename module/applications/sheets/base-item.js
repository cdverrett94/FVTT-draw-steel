export class BaseItemSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    async getData() {
        const data = {
            item: this.item,
            source: this.item.toObject(),
            fields: this.item.system.schema.fields,
        };

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
    }
}
