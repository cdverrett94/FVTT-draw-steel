import { CHARACTERISTICS } from '../constants/characteristics.js';
import { SKILLS } from '../constants/skills.js';

export class BaseActorData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = {};

        // Characteristics
        const characteristics = {};
        for (const characteristic in CHARACTERISTICS) {
            characteristics[characteristic] = new fields.NumberField({
                required: true,
                initial: 0,
                min: -5,
                max: 10,
                integer: true,
                nullable: false,
                label: CHARACTERISTICS[characteristic].label,
            });
        }
        schema.characteristics = new fields.SchemaField(characteristics);

        // Skills
        const skills = {};
        for (const skill in SKILLS) {
            if (['craft', 'knowledge'].includes(skill)) {
                skills[skill] = new fields.ArrayField(
                    new fields.SchemaField(
                        {
                            subskill: new fields.StringField({
                                required: true,
                                nullable: false,
                            }),
                            proficient: new fields.BooleanField({
                                initial: false,
                            }),
                            characteristic: new fields.StringField({
                                initial: SKILLS[skill].default,
                                choices: Object.keys(characteristics),
                            }),
                        },
                        {
                            label: SKILLS[skill].label,
                        }
                    )
                );
            } else {
                skills[skill] = new fields.SchemaField(
                    {
                        proficient: new fields.BooleanField({
                            initial: false,
                        }),
                        characteristic: new fields.StringField({
                            initial: SKILLS[skill].default,
                            choices: Object.keys(characteristics),
                        }),
                    },
                    {
                        label: SKILLS[skill].label,
                    }
                );
            }
        }
        schema.skills = new fields.SchemaField(skills);

        return {
            ...schema,
            hp: new fields.SchemaField({
                current: new fields.NumberField({
                    required: true,
                    initial: 0,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.health.current',
                }),
                max: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.health.max',
                }),
            }),
            size: new fields.SchemaField({
                width: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.width',
                }),
                length: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.length',
                }),
                height: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.height',
                }),
                weight: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.weight',
                }),
            }),
            level: new fields.NumberField({
                required: true,
                initial: 1,
                integer: true,
                max: 10,
                label: 'system.sheets.actor.level',
            }),
            speed: new fields.NumberField({
                label: 'system.sheets.actor.speed',
            }),
            reach: new fields.NumberField({
                label: 'system.sheets.actor.speed',
            }),
        };
    }
}
