import { keywords } from '../../../constants.js';
import { MCDMItemData } from '../base/data-model.js';

export class AbilityData extends MCDMItemData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            keywords: new fields.ArrayField(
                new fields.StringField({
                    nullable: true,
                    choices: keywords,
                })
            ),
            type: new fields.StringField(),
            cost: new fields.StringField(),
            time: new fields.StringField(),
            distance: new fields.StringField(),
            target: new fields.StringField(),
            damage: new fields.StringField(),
            effect: new fields.StringField(),
            trigger: new fields.StringField(),
        };
    }
}
