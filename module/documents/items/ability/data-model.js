import { abilityTimes, abilityTypes, characteristics, damageTypes, keywords } from '../../../constants.js';
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
            type: new fields.StringField({
                choices: abilityTypes,
            }),
            cost: new fields.StringField(),
            time: new fields.StringField({
                choices: Object.keys(abilityTimes),
            }),
            distance: new fields.StringField(),
            target: new fields.StringField(),
            damage: new fields.SchemaField({
                doesDamage: new fields.BooleanField({
                    initial: false,
                }),
                baseFormula: new fields.StringField({
                    initial: '2d6',
                }),
                characteristic: new fields.StringField({
                    choices: Object.keys(characteristics),
                }),
                applyExtraDamage: new fields.BooleanField(),
                banes: new fields.NumberField({
                    initial: 0,
                    min: 0,
                    integer: true,
                }),
                boons: new fields.NumberField({
                    initial: 0,
                    min: 0,
                    integer: true,
                }),
                impacts: new fields.NumberField({
                    initial: 0,
                    integer: true,
                    min: 0,
                }),
                type: new fields.StringField({
                    choices: Object.keys(damageTypes),
                }),
            }),
            effect: new fields.StringField(),
            trigger: new fields.StringField(),
        };
    }
}
