import { CHARACTERISTICS } from '../../constants/characteristics.js';
import { getDataModelChoices } from '../../helpers.js';
import { BaseItemData } from './base-item.js';

export class ClassData extends BaseItemData {
    static LOCALIZATION_PREFIXES = [
        'system.items.class',
        'system.items.class.FIELDS',
        'system.items.class.FIELDS.element',
        'system.items.class.FIELDS.element.fields',
    ];
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            resources: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField(),
                    max: new fields.StringField(),
                })
            ),
            characteristics: new fields.SchemaField({
                starting: new fields.ArrayField(
                    new fields.SchemaField({
                        characteristic: new fields.StringField({
                            choices: getDataModelChoices(CHARACTERISTICS),
                        }),
                        value: new fields.NumberField({
                            integer: true,
                        }),
                    }),
                    {
                        min: 2,
                        max: 2,
                        initial: [
                            {
                                characteristic: 'might',
                                value: 2,
                            },
                            {
                                characteristic: 'agility',
                                value: 2,
                            },
                        ],
                    }
                ),
                arrays: new fields.ArrayField(
                    new fields.SchemaField({
                        array: new fields.ArrayField(new fields.NumberField(), {
                            min: 3,
                            max: 3,
                            initial: [0, 0, 0],
                        }),
                    }),
                    { initial: [{ array: [0, 0, 0] }, { array: [0, 0, 0] }, { array: [0, 0, 0] }] }
                ),
            }),
            stamina: new fields.SchemaField({
                starting: new fields.NumberField(),
                level: new fields.NumberField(),
                recoveries: new fields.NumberField(),
            }),
            resourceGain: new fields.HTMLField(),
            skillChoices: new fields.ObjectField(),
        };
    }
}
