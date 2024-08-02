export class BaseItem extends Item {
    rollOptions(prefix = 'item') {
        const rollOptions = [];

        // add item name
        rollOptions.push(`${prefix}:${this.name.slugify()}`);

        return rollOptions;
    }

    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);

        if (!this.isOwned || this.system.grantedItems.length === 0) return;

        const createData = [];
        for (let index = 0; index < this.system.grantedItems.length; index++) {
            const item = fromUuidSync(this.system.grantedItems[index]);
            const itemData = item.toObject();
            itemData.system.grantedFrom = this.id;

            createData.push(itemData);
        }

        Item.implementation.create(createData, { parent: this.parent });
    }

    _onDelete(data, options, userId) {
        super._onDelete(data, options, userId);

        if (!this.isOwned || this.system.grantedItems.length === 0) return;

        const grantIds = this.grants.map((item) => item.id);
        this.parent.deleteEmbeddedDocuments('Item', grantIds);
    }

    get grants() {
        if (!this.parent) return [];

        return this.parent.items.filter((item) => item.system.grantedFrom === this.id);
    }
}
