import { BaseItemData } from './base-item.js';

export class CareerData extends BaseItemData {
    static LOCALIZATION_PREFIXES = ['system.items.career'];

    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            skillGrants: new fields.ObjectField(),
            skillChoices: new fields.ObjectField(),
            languages: new fields.NumberField({
                integer: true,
                min: 0,
                default: 0,
            }),
            renown: new fields.NumberField({
                integer: true,
                min: 0,
                default: 0,
            }),
            projectPoints: new fields.NumberField({
                integer: true,
                min: 0,
                default: 0,
            }),
            title: new fields.StringField(),
            incidents: new fields.ArrayField(new fields.HTMLField()),
        };
    }
}
