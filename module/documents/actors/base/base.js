import { abilityTypes, characteristics, damageTypes } from '../../../constants.js';

export class MCDMActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    prepareBaseData() {
        super.prepareBaseData();

        for (const [characteristic, score] of Object.entries(this.system.characteristics)) {
            this.system[characteristic] = score;
        }

        this.system.hp.healing = Math.floor(this.system.hp.max / 3);
        this.system.hp.bloodied = Math.floor(this.system.hp.max / 2);
        let abilities = this.items.filter((item) => item.type === 'ability');

        this.system.abilities = {};
        abilityTypes.forEach((abilityType) => {
            this.system.abilities[`${abilityType}`] = abilities.filter((ability) => ability.system.type === abilityType);
        });

        this.system.highest = Math.max(...Object.values(this.system.characteristics));
        this.system.chanceHit = '@Damage[1d4|characteristic=highest]';

        this.system.grappleTN = 7 + this.system.might;

        this.system.conditions = this.items.filter((item) => item.type === 'condition');

        if (this.system.hp.current <= this.system.hp.bloodied && !this.items.find((condition) => condition.name === 'Bloodied')) {
            // TODO push bloodied condition
        }
        if (this.system.hp.current <= 0 && this.system.hp.current > -this.system.hp.bloodied) {
            // TODO push unbalanced condition
        }

        if (this.system.hp.current === -this.system.hp.bloodied) {
            // TODO mark dead
        }

        this.system.boons = {
            attacker: 0,
            attacked: 0,
            tests: 0,
        };
        this.system.banes = {
            attacker: 0,
            attacked: 0,
            tests: 0,
        };
        this.system.ongoingDamage = {};
        for (const damageType in damageTypes) {
            this.system.ongoingDamage[damageType] = 0;
        }

        this.system.taunted = [];

        this.system.frightened = [];
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }

    // Add new craft/knowledge subskill
    async addSkill({ skill, subskill = 'New Skill', characteristic = 'reason', proficient = true } = {}) {
        if (skill !== 'craft' && skill !== 'knowledge') return ui.notifications.error('Skill must be "craft" or "knowledge".');
        if (!(characteristic in characteristics)) return ui.notifications.error('The used characteristic must be a valid one.');
        let skillArray = this.system.skills[skill];
        skillArray.push({
            subskill: subskill,
            characteristic: characteristic,
            proficient: proficient,
        });

        return await this.update({ [`system.skills.${skill}`]: skillArray });
    }

    // Delete new craft/knowledge subskill
    async deleteSkill({ skill, subskill } = {}) {
        if (!skill || !subskill) return ui.notifications.error('Must provide a skill and subskill');
        if (skill !== 'craft' && skill !== 'knowledge') return ui.notifications.error('Skill must be "craft" or "knowledge".');
        let skillArray = this.system.skills[skill];
        let skillIndex = skillArray.findIndex((s) => s.subskill === subskill);
        if (skillIndex === -1) return ui.notifications.error(`No subskill ${subskill} found in ${skill}`);

        skillArray.splice(skillIndex, 1);
        return await this.update({ [`system.skills.${skill}`]: skillArray });
    }
}
