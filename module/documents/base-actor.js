import { FrightenedConfig, OngoingDamageConfig, TauntedConfig } from '../applications/_index.js';
import { ABILITIES, CHARACTERISTICS, CONDITIONS } from '../constants/_index.js';
import { toId } from '../helpers.js';
import { DamageRollDialog, ResistanceRollDialog, TestRollDialog } from '../rolls/_index.js';
import { Predicate } from '../rules/predicate.js';
import { MCDMActiveEffect } from './active-effects.js';

export class BaseActor extends Actor {
    prepareBaseData() {
        this.grantHealthBasedConditions('bloodied', this.system.hp.bloodied);
        this.grantHealthBasedConditions('unbalanced', 0);
        this.grantHealthBasedConditions('dead', -this.system.hp.bloodied);

        super.prepareBaseData();
    }

    grantHealthBasedConditions(condition, threshold) {
        const existingEffect = this.effects.find((effect) => effect._id === CONDITIONS[condition]._id);
        if (this.system.hp.current <= threshold && !existingEffect) {
            const newEffect = new MCDMActiveEffect(CONDITIONS[condition]);
            this.effects.set(newEffect._id, newEffect);
        } else if (this.system.hp.current > threshold && existingEffect) {
            this.effects.delete(CONDITIONS[condition]._id);
        }
    }

    get allowedAbilityTypes() {
        const allowedAbilityTypes = {};
        for (const [key, value] of Object.entries(ABILITIES.TYPES)) {
            if (value.appliesTo.includes(this.type)) allowedAbilityTypes[key] = value;
        }
        return allowedAbilityTypes;
    }

    get abilities() {
        let allAbilities = this.items.filter((item) => item.type === 'ability');
        const abilities = {};
        Object.keys(this.allowedAbilityTypes).forEach((type) => (abilities[type] = []));
        abilities.invalid = [];

        allAbilities.forEach((ability) => {
            if (ability.system.type in this.allowedAbilityTypes) abilities[ability.system.type].push(ability);
            else abilities['invalid'].push(ability);
        });
        return abilities;
    }

    // Add new craft/knowledge subskill
    async addSkill({ skill, subskill = 'New Skill', characteristic = 'reason', proficient = true } = {}) {
        if (skill !== 'craft' && skill !== 'knowledge') return ui.notifications.error('Skill must be "craft" or "knowledge".');
        if (!(characteristic in CHARACTERISTICS)) return ui.notifications.error('The used characteristic must be a valid one.');
        let skillArray = this.system.skills[skill];
        skillArray.push({
            subskill: subskill,
            characteristic: characteristic,
            proficient: proficient,
        });

        return await this.update({ [`system.skills.${skill}`]: skillArray });
    }

    // Delete craft/knowledge subskill
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
        if (['ongoingdamage', 'taunted', 'frightened'].includes(statusId)) active = true;
        let returnedEffect = await super.toggleStatusEffect(statusId, { active, overlay });
        if (returnedEffect === false) return false;

        let effect = returnedEffect;
        if (returnedEffect === true) effect = this.effects.get(toId(statusId));

        let config;
        if (statusId === 'ongoingdamage') {
            config = new OngoingDamageConfig({ effect });
        } else if (statusId === 'taunted') {
            config = new TauntedConfig({ effect });
        } else if (statusId === 'frightened') {
            config = new FrightenedConfig({ effect });
        }
        config?.render(true);

        return returnedEffect;
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

        const targets = game.user.targets;
        if (!targets.size) return ui.notifications.error('You must select a target');
        let targetsBoons = {};
        targets.forEach((target) => {
            targetsBoons[target.document.uuid] = this.#getTargetBoons(target);
        });

        const actorBoons = this.#getActorBoons();
        boons += actorBoons.boons;
        banes += actorBoons.banes;

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
            targets: targetsBoons,
        };
        await new DamageRollDialog(context).render(true);
    }

    #getActorBoons() {
        let rollData = {
            boons: 0,
            banes: 0,
        };
        if (this.system.banes.attacker) rollData.banes += Number(this.system.banes.attacker);
        if (this.system.boons.attacker) rollData.boons += Number(this.system.boons.attacker);

        return rollData;
    }

    #getTargetBoons(target) {
        let rollData = {
            boons: 0,
            banes: 0,
            impacts: 0,
        };

        // Get Boons/Banes that apply when target is attacked
        if (target) {
            if (target.actor.system.boons.attacked) rollData.boons += target.actor.system.boons.attacked;
            if (target.actor.system.banes.attacked) rollData.banes += target.actor.system.banes.attacked;
        }
        // Get Banes if attacking a creature you are frightened by
        const attackingFrightenedByPredicate = new Predicate([`actor:condition:frightened:${target.actor.uuid}`], this.rollOptions());
        if (attackingFrightenedByPredicate.validate()) rollData.banes += 1;

        // Get Boons if attacking a creature you have frightened
        const attackingFrightenedPredicate = new Predicate([`target:condition:frightened:${this.uuid}`], target.actor.rollOptions('target'));
        if (attackingFrightenedPredicate.validate()) rollData.boons += 1;

        // Get Banes if attacking a creature a creature other than one that has you taunted
        const attackingNontauntedPredicate = new Predicate(
            ['actor:condition:taunted', { not: [`actor:condition:taunted`, target.actor.uuid] }],
            this.rollOptions()
        );
        if (attackingNontauntedPredicate.validate()) rollData.banes += 1;

        return rollData;
    }

    async applyDamage({ amount = 0, type = 'untyped' } = {}) {
        // TODO: LATER APPLY WEAKNESSES AND IMMUNITIES
        const currentHP = this.system.hp.current;
        const newHP = currentHP - amount;

        await this.update({ 'system.hp.current': newHP });
    }

    async _preUpdate(changed, options, user) {
        // Cap HP to new max and bloodied value
        if (changed.system && 'hp' in changed.system) {
            const currentHP = this.system.hp.current;

            let newCurrentHP = changed.system.hp.current ?? this.system.hp.current;
            let newMaxHP = changed.system.hp.max ?? this.system.hp.max;
            let newBloodiedValue = Math.floor(newMaxHP / 2);

            const newAppliedHP = Math.clamp(newCurrentHP, -newBloodiedValue, newMaxHP);
            const hpDelta = newAppliedHP - currentHP;

            options.hpDelta = hpDelta;
            changed.system.hp.current = newAppliedHP;
        }

        await super._preUpdate(changed, options, user);
    }

    _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);

        // HP CHANGES SCROLLING STATUS TEXT
        if (changed.system && 'hp' in changed.system && 'current' in changed.system.hp) {
            const tokens = this.isToken ? [this.token] : this.getActiveTokens(true, true);
            if (!tokens.length) return;
            const pct = Math.clamp(Math.abs(options.hpDelta) / this.system.hp.max, 0, 1);
            for (const token of tokens) {
                if (!token.object?.visible || !token.object?.renderable) continue;
                const t = token.object;
                canvas.interface.createScrollingText(t.center, options.hpDelta.signedString(), {
                    anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
                    // Adapt the font size relative to the Actor's HP total to emphasize more significant blows
                    fontSize: 16 + 32 * pct, // Range between [16, 48]
                    fill: options.hpDelta > 0 ? 'green' : 'red',
                    stroke: 0x000000,
                    strokeThickness: 4,
                    jitter: Math.random(),
                });
            }
        }
    }

    rollOptions(prefix = 'actor') {
        const rollOptions = [];

        // add uuid
        rollOptions.push(`${prefix}:uuid:${this.uuid}`);

        // add level
        rollOptions.push(`${prefix}:level:${this.system.level}`);

        // add hp
        Object.entries(this.system.hp).forEach((entry) => rollOptions.push(`${prefix}:hp:${entry[0]}:${entry[1]}`));
        const hpPercentage = Math.floor(this.system.hp.current / this.system.hp.max);
        rollOptions.push(`${prefix}:hp:percentage:${hpPercentage}`);

        // add characteristics
        Object.entries(this.system.characteristics).forEach((entry) => rollOptions.push(`${prefix}:characteristic:${entry[0]}:${entry[1]}`));

        // add abilities
        Object.entries(this.abilities).forEach((entry) => {
            const [abilityGroup, abilities] = entry;

            abilities.forEach((ability) => rollOptions.push(`${prefix}:abilities:${abilityGroup}:${ability.name.slugify()}`));
        });

        // add conditions
        Object.entries(CONDITIONS).forEach((condition) => {
            const [key, value] = condition;
            const actorCondition = this.effects.find((effect) => effect._id === value._id);
            if (!actorCondition) return;

            rollOptions.push(`${prefix}:condition:${key}`);
            if (key === 'ongoingdamage') {
                Object.keys(DAMAGE.TYPES).forEach((type) => {
                    if (this.ongoingDamage[type] > 0) rollOptions.push(`${prefix}:condition:${key}:${this.ongoingDamage[type]}`);
                });
            } else if (key === 'taunted' || key === 'frightened') {
                actorCondition.changes.forEach((change) => {
                    if (change.value) rollOptions.push(`${prefix}:condition:${key}:${change.value}`);
                });
            }
        });

        return rollOptions.sort();
    }
}
