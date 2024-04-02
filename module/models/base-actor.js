import { CHARACTERISTICS, DAMAGE, SKILLS } from '../constants/_index.js';
import { getDataModelChoices } from '../helpers.js';

export class BaseActorData extends foundry.abstract.TypeDataModel {
    static LOCALIZATION_PREFIXES = ['system.actors.base', 'system.skills'];
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
            });
        }
        schema.characteristics = new fields.SchemaField(characteristics);

        // Skills
        const skills = {};
        for (const skillCategory in SKILLS) {
            if (skillCategory === 'label') continue;
            const category = SKILLS[skillCategory];
            const subskills = {};
            for (const skill in category) {
                if (skill === 'label') continue;
                subskills[skill] = new fields.SchemaField({
                    proficient: new fields.BooleanField({
                        initial: false,
                    }),
                    characteristic: new fields.StringField({
                        initial: SKILLS[skillCategory][skill].default,
                        choices: getDataModelChoices(CHARACTERISTICS),
                    }),
                    display: new fields.BooleanField({
                        initial: false,
                    }),
                });
            }

            skills[skillCategory] = new fields.SchemaField(subskills);
        }
        skills.customSkills = new fields.ArrayField(
            new fields.SchemaField({
                name: new fields.StringField(),
                proficient: new fields.BooleanField({
                    initial: false,
                }),
                characteristic: new fields.StringField({
                    initial: 'reason',
                    choices: getDataModelChoices(CHARACTERISTICS),
                }),
                category: new fields.StringField({
                    initial: 'crafting',
                    choices: getDataModelChoices(SKILLS),
                }),
                display: new fields.BooleanField({
                    initial: false,
                }),
            })
        );

        schema.skills = new fields.SchemaField(skills);

        return {
            ...schema,
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
            level: new fields.NumberField({
                required: true,
                initial: 1,
                integer: true,
                max: 10,
            }),
            speed: new fields.NumberField({
                label: 'system.sheets.actor.speed',
            }),
            reach: new fields.NumberField({
                label: 'system.sheets.actor.reach',
            }),
            combat: new fields.SchemaField({
                turns: new fields.NumberField({
                    initial: 2,
                }),
            }),
        };
    }

    prepareBaseData() {
        for (const [characteristic, score] of Object.entries(this.characteristics)) {
            this[characteristic] = score;
        }

        for (const customSkill in this.skills.customSkills) {
            const skill = this.skills.customSkills[customSkill];

            if (!this.skills[skill.category][skill.name.slugify()]) {
                this.skills[skill.category][skill.name.slugify()] = {
                    characteristic: skill.characteristic,
                    proficient: skill.proficient,
                    label: skill.name,
                    isCustom: true,
                    display: skill.display,
                };
            }
        }

        this.hp.healing = Math.floor(this.hp.max / 3);
        this.hp.bloodied = Math.floor(this.hp.max / 2);

        this.grappleTN = 7 + this.characteristics.might;

        // Setting values for Active Effects to target
        this.edges = {
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
