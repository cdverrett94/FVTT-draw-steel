import { BaseItemData } from './base-item.js';

export class KitData extends BaseItemData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            type: new fields.StringField({
                label: 'system.items.kit.fields.type',
            }),
            armor: new fields.StringField({
                label: 'system.items.kit.fields.armor',
            }),
            weapon: new fields.StringField({
                label: 'system.items.kit.fields.weapon',
            }),
            area: new fields.StringField({
                label: 'system.items.kit.fields.area',
            }),
            health: new fields.StringField({
                label: 'system.items.kit.fields.health',
            }),
            damage: new fields.NumberField({
                label: 'system.items.kit.fields.damage',
            }),
            reach: new fields.StringField({
                label: 'system.items.kit.fields.reach',
            }),
            speed: new fields.StringField({
                label: 'system.items.kit.fields.speed',
            }),
            range: new fields.NumberField({
                label: 'system.items.kit.fields.range',
            }),
            resistanceTN: new fields.NumberField({
                label: 'system.items.kit.fields.resistanceTn',
            }),
        };
    }
}
