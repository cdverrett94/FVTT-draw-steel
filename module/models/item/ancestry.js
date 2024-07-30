import { BaseItemData } from './base-item.js';

export class AncestryData extends BaseItemData {
    static LOCALIZATION_PREFIXES = ['system.items.ancestry'];

    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            size: new fields.SchemaField({
                width: new fields.NumberField({}),
                length: new fields.NumberField({}),
                height: new fields.NumberField({}),
                weight: new fields.NumberField({}),
            }),
            reach: new fields.NumberField({}),
            speed: new fields.NumberField({}),
        };
    }
}
