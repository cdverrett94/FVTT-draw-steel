import { BaseItemData } from './base-item.js';

export class AncestryData extends BaseItemData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            size: new fields.SchemaField({
                width: new fields.NumberField({
                    label: 'system.items.ancestry.fields.size.width.label',
                }),
                length: new fields.NumberField({
                    label: 'system.items.ancestry.fields.size.length.label',
                }),
                height: new fields.NumberField({
                    label: 'system.items.ancestry.fields.size.height.label',
                }),
                weight: new fields.NumberField({
                    label: 'system.items.ancestry.fields.size.weight.label',
                }),
            }),
            reach: new fields.NumberField({
                label: 'system.items.ancestry.fields.reach.label',
            }),
            speed: new fields.NumberField({
                label: 'system.items.ancestry.fields.speed.label',
            }),
            description: new fields.StringField({
                label: 'system.items.ancestry.fields.description.label',
            }),
        };
    }
}
