import { MCDMItemData } from '../base/data-model.js';

export class ConditionData extends MCDMItemData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            target: new fields.StringField(),
            value: new fields.StringField(),
            description: new fields.StringField(),
        };
    }
}
