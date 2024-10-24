import { ABILITIES, CHARACTERISTICS, DAMAGE } from '../../constants/_index.js';
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
        for (const skillCategory in game['draw-steel'].skills) {
            if (skillCategory === 'label') continue;
            const category = game['draw-steel'].skills[skillCategory];
            const subskills = {};
            for (const skill in category) {
                if (skill === 'label') continue;
                subskills[skill] = new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: game['draw-steel'].skills[skillCategory][skill].default,
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
                label: DAMAGE.TYPES[damageType].label,
            });
            immunities[damageType] = new fields.NumberField({
                min: 0,
                initial: 0,
                label: DAMAGE.TYPES[damageType].label,
            });
        }
        const iwKeywords = ['magic', 'psionic', 'weapon'];
        for (const keyword of iwKeywords) {
            weaknesses[keyword] = new fields.NumberField({
                min: 0,
                initial: 0,
                label: ABILITIES.KEYWORDS[keyword].label,
            });
            immunities[keyword] = new fields.NumberField({
                min: 0,
                initial: 0,
                label: ABILITIES.KEYWORDS[keyword].label,
            });
        }
        weaknesses.forced = new fields.NumberField({
            min: 0,
            initial: 0,
            label: 'Forced Move',
        });
        immunities.forced = new fields.NumberField({
            min: 0,
            initial: 0,
            label: 'Forced Move',
        });
        weaknesses.all = new fields.NumberField({
            min: 0,
            initial: 0,
            nullable: true,
            label: 'All',
        });
        immunities.all = new fields.NumberField({
            min: 0,
            initial: 0,
            nullable: true,
            label: 'All',
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
                temporary: new fields.NumberField({
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
            speed: new fields.NumberField(),
            size: new fields.NumberField(),
            weight: new fields.NumberField(),
            reach: new fields.NumberField(),
            stability: new fields.NumberField(),
            combat: new fields.SchemaField({
                turns: new fields.NumberField({
                    initial: 1,
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
        this.bonuses = {
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

    get highest() {
        return Math.max(...Object.values(this.characteristics));
    }
}
