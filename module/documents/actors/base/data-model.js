import { characteristics } from '../../../constants.js';

export class MCDMActorData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            characteristics: new fields.SchemaField({
                might: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                agility: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                endurance: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                reason: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                intuition: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                presence: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
            }),
            hp: new fields.SchemaField({
                current: new fields.NumberField({
                    required: true,
                    initial: 0,
                    integer: true,
                    nullable: false,
                }),
                max: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                }),
            }),
            size: new fields.SchemaField({
                width: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
                length: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
                height: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
                weight: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
            }),
            level: new fields.NumberField({
                required: true,
                initial: 1,
                integer: true,
            }),
            speed: new fields.NumberField(),
            reach: new fields.NumberField(),
            skills: new fields.SchemaField({
                acrobatics: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'agility',
                        choices: Object.keys(characteristics),
                    }),
                }),
                athletics: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'might',
                        choices: Object.keys(characteristics),
                    }),
                }),
                charm: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'presence',
                        choices: Object.keys(characteristics),
                    }),
                }),
                craft: new fields.ArrayField(
                    new fields.SchemaField({
                        subskill: new fields.StringField({
                            required: true,
                            nullable: false,
                        }),
                        proficient: new fields.BooleanField({
                            initial: false,
                        }),
                        characteristic: new fields.StringField({
                            initial: 'reason',
                            choices: Object.keys(characteristics),
                        }),
                    })
                ),
                deceive: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'presence',
                        choices: Object.keys(characteristics),
                    }),
                }),
                empathy: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'intuition',
                        choices: Object.keys(characteristics),
                    }),
                }),
                intimidate: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'presence',
                        choices: Object.keys(characteristics),
                    }),
                }),
                knowledge: new fields.ArrayField(
                    new fields.SchemaField({
                        subskill: new fields.StringField({
                            required: true,
                            nullable: false,
                        }),
                        proficient: new fields.BooleanField({
                            initial: false,
                        }),
                        characteristic: new fields.StringField({
                            initial: 'reason',
                            choices: Object.keys(characteristics),
                        }),
                    })
                ),
                notice: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'intuition',
                        choices: Object.keys(characteristics),
                    }),
                }),
                skulduggery: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'agility',
                        choices: Object.keys(characteristics),
                    }),
                }),
                stealth: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'agility',
                        choices: Object.keys(characteristics),
                    }),
                }),
                vigor: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'might',
                        choices: Object.keys(characteristics),
                    }),
                }),
            }),
        };
    }
}
