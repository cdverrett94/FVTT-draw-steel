import { BaseItemData } from './base-item.js';

export class ClassData extends BaseItemData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            resources: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({
                        label: 'system.items.class.fields.resources.name.label',
                    }),
                    max: new fields.StringField({
                        label: 'system.items.class.fields.resources.max.label',
                    }),
                })
            ),
            description: new fields.StringField(),
            victoryBenefits: new fields.StringField(),
            resourceGain: new fields.StringField(),
        };
    }
}
