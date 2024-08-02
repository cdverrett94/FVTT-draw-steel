import { BaseItemData } from './base-item.js';

export class AncestryData extends BaseItemData {
    static LOCALIZATION_PREFIXES = ['system.items.ancestry'];

    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            size: new fields.NumberField({
                min: 0,
                initial: 0,
                integer: true,
            }),
            weight: new fields.NumberField({
                min: 0,
                initial: 0,
                integer: true,
            }),
            reach: new fields.NumberField({
                min: 0,
                initial: 0,
                integer: true,
            }),
            speed: new fields.NumberField({
                min: 0,
                initial: 0,
                integer: true,
            }),
        };
    }
}
