import { characteristics } from '../../../constants.js';
import { MCDMActorData } from '../base/data-model.js';

export class HeroData extends MCDMActorData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            victories: new fields.NumberField({
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                nullable: false,
            }),
            xp: new fields.NumberField({
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                nullable: false,
            }),
            recoveries: new fields.SchemaField({
                current: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
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
            resources: new fields.SchemaField({
                one: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                }),
                two: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                }),
            }),
            skills: new fields.SchemaField({
                acrobatics: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'agility',
                        choices: characteristics,
                    }),
                }),
                athletics: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'might',
                        choices: characteristics,
                    }),
                }),
                charm: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'presence',
                        choices: characteristics,
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
                            choices: characteristics,
                        }),
                    })
                ),
                deceive: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'presence',
                        choices: characteristics,
                    }),
                }),
                empathy: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'intuition',
                        choices: characteristics,
                    }),
                }),
                intimidate: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'presence',
                        choices: characteristics,
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
                            choices: characteristics,
                        }),
                    })
                ),
                notice: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'intuition',
                        choices: characteristics,
                    }),
                }),
                skulduggery: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'agility',
                        choices: characteristics,
                    }),
                }),
                stealth: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'agility',
                        choices: characteristics,
                    }),
                }),
                vigor: new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: 'might',
                        choices: characteristics,
                    }),
                }),
            }),
        };
    }
}
