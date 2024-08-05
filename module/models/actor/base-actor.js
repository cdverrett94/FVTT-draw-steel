import { CHARACTERISTICS, DAMAGE } from '../../constants/_index.js';
import { getDataModelChoices } from '../../helpers.js';

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
                max: 5,
                integer: true,
                nullable: false,
            });
        }
        schema.characteristics = new fields.SchemaField(characteristics);

        // Skills
        const skills = {};
        for (const skillCategory in game.mcdmrpg.skills) {
            if (skillCategory === 'label') continue;
            const category = game.mcdmrpg.skills[skillCategory];
            const subskills = {};
            for (const skill in category) {
                if (skill === 'label') continue;
                subskills[skill] = new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: game.mcdmrpg.skills[skillCategory][skill].default,
                        choices: getDataModelChoices(CHARACTERISTICS),
                    }),
                    display: new fields.BooleanField({
                        initial: true,
                    }),
                });
            }

            skills[skillCategory] = new fields.SchemaField(subskills);
        }

        const weaknesses = {};
        const immunities = {};
        for (const damageType in DAMAGE.TYPES) {
            weaknesses[damageType] = new fields.NumberField({
                min: 0,
                initial: 0,
            });
            immunities[damageType] = new fields.NumberField({
                min: 0,
                initial: 0,
            });
        }
        const iwKeywords = ['magic', 'psionic', 'weapon'];
        for (const keyword of iwKeywords) {
            weaknesses[keyword] = new fields.NumberField({
                min: 0,
                initial: 0,
            });
            immunities[keyword] = new fields.NumberField({
                min: 0,
                initial: 0,
            });
        }
        weaknesses.forced = new fields.NumberField({
            min: 0,
            initial: 0,
        });
        immunities.forced = new fields.NumberField({
            min: 0,
            initial: 0,
        });
        weaknesses.all = new fields.NumberField({
            min: 0,
            initial: 0,
            nullable: true,
        });
        immunities.all = new fields.NumberField({
            min: 0,
            initial: 0,
            nullable: true,
        });

        schema.skills = new fields.SchemaField(skills);

        schema.immunities = new fields.SchemaField(immunities);
        schema.weaknesses = new fields.SchemaField(weaknesses);

        return {
            ...schema,
            stamina: new fields.SchemaField({
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
            level: new fields.NumberField({
                required: true,
                initial: 1,
                integer: true,
                max: 10,
            }),
            speed: new fields.NumberField({
                label: 'system.sheets.actor.speed',
            }),
            size: new fields.NumberField({
                label: 'system.sheets.actor.size',
            }),
            weight: new fields.NumberField({
                label: 'system.sheets.actor.weight',
            }),
            reach: new fields.NumberField({
                label: 'system.sheets.actor.reach',
            }),
            stability: new fields.NumberField({
                label: 'system.sheets.actor.stability',
            }),
            combat: new fields.SchemaField({
                turns: new fields.NumberField({
                    initial: 2,
                }),
            }),
            notes: new fields.HTMLField(),
            languages: new fields.ArrayField(new fields.StringField()),
        };
    }

    prepareBaseData() {
        for (const [characteristic, score] of Object.entries(this.characteristics)) {
            this[characteristic] = score;
        }

        this.grappleTN = 7 + this.characteristics.might;

        // Setting values for Active Effects to target
        this.edges = {
            attacker: 0,
            attacked: 0,
            tests: 0,
            resistance: 0,
        };
        this.banes = {
            attacker: 0,
            attacked: 0,
            tests: 0,
            resistance: 0,
        };
        this.taunted = [];
        this.frightened = [];
        for (const type in this.immunities) {
            if (this.immunities[type] === null) this.immunities[type] = Infinity;
        }
        for (const type in this.weaknesses) {
            if (this.weaknesses[type] === null) this.weaknesses[type] = Infinity;
        }
    }

    prepareDerivedData() {
        this.stamina.winded = Math.floor(this.stamina.max / 2);
    }
}
