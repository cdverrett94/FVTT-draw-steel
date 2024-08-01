export class BaseItem extends Item {
    rollOptions(prefix = 'item') {
        const rollOptions = [];

        // add item name
        rollOptions.push(`${prefix}:${this.name.slugify()}`);

        return rollOptions;
    }

    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);

        if (!this.isOwned || this.system.grantedFeatures.length === 0) return;

        const createData = [];
        for (let index = 0; index < this.system.grantedFeatures.length; index++) {
            const item = fromUuidSync(this.system.grantedFeatures[index]);
            createData.push(item.toObject());
        }

        Item.implementation.create(createData, { parent: this.parent });
    }
}
