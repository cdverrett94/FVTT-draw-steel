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

    async toggleStatusEffect(statusId, { active, overlay = false } = {}) {
        const isSpecialStatus = ['ongoingdamage', 'taunted', 'frightened'].includes(statusId);
        console.log('isSpecialStatus', isSpecialStatus);
        const status = CONFIG.statusEffects.find((e) => e.id === statusId);
        if (!status) throw new Error(`Invalid status ID "${statusId}" provided to Actor#toggleStatusEffect`);
        const existing = [];

        // Find the effect with the static _id of the status effect
        if (status._id) {
            const effect = this.effects.get(status._id);
            if (effect) existing.push(effect.id);
        }

        // If no static _id, find all single-status effects that have this status
        else {
            for (const effect of this.effects) {
                const statuses = effect.statuses;
                if (statuses.size === 1 && statuses.has(status.id)) existing.push(effect.id);
            }
        }

        // Remove the existing effects unless the status effect is forced active
        if (existing.length && !isSpecialStatus) {
            if (active) return true;
            await this.deleteEmbeddedDocuments('ActiveEffect', existing);
            return false;
        } else if (existing.length && isSpecialStatus) {
            const effect = this.effects.get(existing[0]);
            effect.sheet.render(true);
            return effect;
        }

        // Create a new effect unless the status effect is forced inactive
        if (!active && active !== undefined) return;
        const effect = await ActiveEffect.implementation.fromStatusEffect(statusId);
        if (overlay) effect.updateSource({ 'flags.core.overlay': true });
        const createdEffect = await ActiveEffect.implementation.create(effect, { parent: this, keepId: true });
        if (isSpecialStatus) createdEffect.sheet.render(true);
        return createdEffect;
    }
}
