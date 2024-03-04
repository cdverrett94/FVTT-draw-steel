import { abilityTypes, characteristics, damageTypes } from '../../../constants.js';
import { DamageRollDialog } from '../../rolls/damage/roll-dialog/roll-dialog.js';
import { ResistanceRollDialog } from '../../rolls/resistance/roll-dialog/roll-dialog.js';
import { TestRollDialog } from '../../rolls/test/roll-dialog/roll-dialog.js';

export class MCDMActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    prepareBaseData() {
        super.prepareBaseData();

        for (const [characteristic, score] of Object.entries(this.system.characteristics)) {
            this.system[characteristic] = score;
        }

        this.system.acceptableAbilityTypes = {};
        for (const [key, value] of Object.entries(abilityTypes)) {
            if (value.appliesTo.includes(this.type)) this.system.acceptableAbilityTypes[key] = value;
        }

        let abilities = this.items.filter((item) => item.type === 'ability');
        this.system.abilities = {};
        for (const abilityType in this.system.acceptableAbilityTypes) {
            this.system.abilities[abilityType] = abilities.filter((ability) => ability.system.type === abilityType);
        }

        this.system.hp.healing = Math.floor(this.system.hp.max / 3);
        this.system.hp.bloodied = Math.floor(this.system.hp.max / 2);

        this.system.highest = Math.max(...Object.values(this.system.characteristics));
        this.system.chanceHit = '@Damage[1d4|characteristic=highest|abilityName=mcdmrpg.rolls.damage.chancehit]';

        this.system.grappleTN = 7 + this.system.might;

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

    async rollCharacteristic(characteristic) {
        let modifier = this.system.characteristics[characteristic];
        let roll = await Roll.create(`2d6 + ${modifier}`).evaluate();
        roll.toMessage({
            flavor: `${characteristic} Roll`,
        });
    }

    async rollTest(data = {}) {
        let { baseFormula, banes, boons, characteristic, formula, skill, subskill, tn } = data;

        // set skill proficiency
        let proficient;
        if (['craft', 'knowledge'].includes(skill)) proficient = this.system.skills[skill].find((sub) => sub.subskill === subskill)?.proficient ?? false;
        else proficient = this.system.skills[skill].proficient;

        // set skill characteristic if there is none;
        if (!characteristic) {
            if (['craft', 'knowledge'].includes(skill)) characteristic = this.system.skills[skill].find((sub) => sub.subskill === subskill)?.characteristic;
            else characteristic = this.system.skills[skill].characteristic;
        }

        if (this.system.banes.tests) banes += Number(this.system.banes.tests);
        if (this.system.boons.tests) banes += Number(this.system.boons.tests);

        let context = {
            actor: this,
            baseFormula,
            banes,
            boons,
            characteristic,
            formula,
            proficient,
            skill,
            subskill,
            tn,
        };
        await new TestRollDialog(context).render(true);
    }

    async rollResistance(data = {}) {
        let { baseFormula, banes, boons, characteristic, formula, tn } = data;

        let context = {
            actor: this,
            baseFormula,
            banes,
            boons,
            characteristic,
            formula,
            tn,
        };
        await new ResistanceRollDialog(context).render(true);
    }

    async rollDamage(data = {}) {
        let { abilityName, applyExtraDamage, baseFormula, banes, boons, characteristic, damageType, formula, impacts } = data;

        if (this.system.banes.attacker) banes += Number(this.system.banes.attacker);
        if (this.system.boons.attacker) boons += Number(this.system.boons.attacker);

        // General boon/bane adjustments from effects
        let [target] = game.user.targets;
        if (target) {
            if (target.actor.system.boons.attacked) boons += target.actor.system.boons.attacked;
            if (target.actor.system.banes.attacked) banes += target.actor.system.banes.attacked;
        }

        // boon/bane adjustments from frightened
        if (this.system.frightened && target && this.system.frightened.includes(target?.actor.uuid)) banes += 1;
        if (target?.actor.system.frightened && target?.actor.system.frightened.includes(this.uuid)) banes += 1;

        // boon/bane adjustments from taunted
        if (this.system.taunted.length && target && !this.system.taunted.includes(target.actor.uuid)) banes += 1;

        let context = {
            abilityName,
            actor: this,
            applyExtraDamage,
            baseFormula,
            banes,
            boons,
            characteristic,
            damageType,
            formula,
            impacts,
        };
        await new DamageRollDialog(context).render(true);
    }
}
