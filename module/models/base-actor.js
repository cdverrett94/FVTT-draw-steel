import { CHARACTERISTICS } from '../constants/characteristics.js';
import { DAMAGE } from '../constants/damage.js';
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
                label: 'system.sheets.actor.reach',
            }),
        };
    }

    prepareBaseData() {
        for (const [characteristic, score] of Object.entries(this.characteristics)) {
            this[characteristic] = score;
        }

        this.hp.healing = Math.floor(this.hp.max / 3);
        this.hp.bloodied = Math.floor(this.hp.max / 2);

        this.highest = Math.max(...Object.values(this.characteristics));
        this.chanceHit = '@Damage[1d4|characteristic=highest|abilityName=system.rolls.damage.chancehit]';

        this.grappleTN = 7 + this.characteristics.might;

        // Setting values for Active Effects to target
        this.boons = {
            attacker: 0,
            attacked: 0,
            tests: 0,
        };
        this.banes = {
            attacker: 0,
            attacked: 0,
            tests: 0,
        };
        this.ongoingDamage = {};
        for (const damageType in DAMAGE.TYPES) {
            this.ongoingDamage[damageType] = 0;
        }
        this.taunted = [];
        this.frightened = [];
    }
}
