import { MCDMItemData } from '../base/data-model.js';

export class AncestryData extends MCDMItemData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            size: new fields.SchemaField({
                width: new fields.NumberField(),
                length: new fields.NumberField(),
                height: new fields.NumberField(),
                weight: new fields.NumberField(),
            }),
            reach: new fields.NumberField(),
            speed: new fields.NumberField(),
            description: new fields.StringField(),
        };
    }
}
