import { FrightenedConfig, OngoingDamageConfig, TauntedConfig } from '../applications/_index.js';
import { ABILITIES, CHARACTERISTICS, CONDITIONS } from '../constants/_index.js';
import { toId } from '../helpers.js';
import { TestPowerRollDialog } from '../rolls/_index.js';
import { MCDMActiveEffect } from './active-effects.js';

export class BaseActor extends Actor {
    prepareBaseData() {
        this.grantStaminaBasedConditions('winded', this.system.stamina.winded);
        this.grantStaminaBasedConditions('unbalanced', 0);
        this.grantStaminaBasedConditions('dead', -this.system.stamina.winded);

        super.prepareBaseData();
    }

    grantStaminaBasedConditions(condition, threshold) {
        const existingEffect = this.effects.find((effect) => effect._id === CONDITIONS[condition]._id);
        if (this.system.stamina.current <= threshold && !existingEffect) {
            const newEffect = new MCDMActiveEffect(CONDITIONS[condition]);
            this.effects.set(newEffect._id, newEffect);
        } else if (this.system.stamina.current > threshold && existingEffect) {
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

    // Add Custom Skill
    async addCustomSkill({ name = 'New Skill', characteristic = 'might', proficient = true, category = 'crafting' } = {}) {
        if (!(characteristic in CHARACTERISTICS)) characteristic = 'might';
        const skillArray = this.system.skills.customSkills;
        skillArray.push({
            name,
            characteristic,
            proficient,
            category,
        });

        return await this.update({ 'system.skills.customSkills': skillArray });
    }

    // Delete craft/knowledge subskill
    async deleteCustomSkill({ name, index } = {}) {
        const skillArray = this.system.skills.customSkills;
        if (!skillArray) return false;
        if (!index) {
            if (!name) return ui.notifications.error('A custom skill name or index must be provided.');
            index = skillArray.findIndex((s) => s.name === name);
            if (index === -1) return ui.notifications.error(`No custom skill found with that name.`);
        }

        skillArray.splice(index, 1);
        return await this.update({ 'system.skills.customSkills': skillArray });
    }

    async toggleStatusEffect(statusId, { active, overlay = false } = {}) {
        if (['ongoingdamage', 'taunted', 'frightened'].includes(statusId)) active = true;
        else if (statusId === 'prone') {
            const unconscious = this.effects.get(toId('unconscious'));
            if (unconscious) {
                active = true;
                ui.notifications.error(`You can't remove prone while unconsious`);
            }
        } else if (['winded', 'unbalanced'].includes(statusId)) {
            ui.notifications.error(`You can't manually toggle ${statusId}. It will automatically apply based on current stamina`);
            return false;
        }
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
        } else if (statusId === 'unconscious') {
            await this.toggleStatusEffect('prone', { active: true });
        }
        config?.render(true);

        return returnedEffect;
    }

    async rollCharacteristic({ characteristic } = {}) {
        if (!characteristic || !(characteristic in CHARACTERISTICS)) return false;
        let modifier = this.system.characteristics[characteristic];
        let roll = await Roll.create(`2d6 + ${modifier}`).evaluate();
        let title = game.i18n.format('system.rolls.characteristic.label', {
            characteristic: game.i18n.localize(`system.characteristics.${characteristic}.label`),
        });

        roll.toMessage({
            flavor: title,
        });

        return roll;
    }

    async rollSkillTest({ category, skill, characteristic }) {
        if (!skill) return ui.notifications.error('No skill provided to roll');
        if (!category) {
            const foundCategory = Object.entries(this.system.skills).find((category) => skill in category[1]);
            if (foundCategory) category = foundCategory[0];
        }

        const foundSkill = this.system.skills[category]?.[skill];

        characteristic ??= foundSkill?.characteristic;

        let edges = foundSkill?.proficient ? 1 : 0;
        edges += this.system.edges.tests;
        let banes = this.system.banes.tests;
        let bonuses = 0;

        const rollData = {
            actor: this,
            characteristic,
            category,
            skill,
            general: {
                edges,
                banes,
                bonuses,
            },
        };

        await new TestPowerRollDialog(rollData).render(true);
    }

    async applyDamage({ amount = 0, type = 'untyped' } = {}) {
        // TODO: LATER APPLY WEAKNESSES AND IMMUNITIES
        const currentHP = this.system.stamina.current;
        const newHP = currentHP - amount;

        await this.update({ 'system.stamina.current': newHP });
    }

    async _preUpdate(changed, options, user) {
        // Cap HP to new max and winded value
        if (changed.system && 'stamina' in changed.system) {
            const currentStamina = this.system.stamina.current;

            let newCurrentStamina = changed.system.stamina.current ?? this.system.stamina.current;
            let newMaxStamina = changed.system.stamina.max ?? this.system.stamina.max;
            let newWindedValue = Math.floor(newMaxStamina / 2);

            const newAppliedStamina = Math.clamp(newCurrentStamina, -newWindedValue, newMaxStamina);
            const staminaDelta = newAppliedStamina - currentStamina;

            options.staminaDelta = staminaDelta;
            changed.system.stamina.current = newAppliedStamina;
        }

        await super._preUpdate(changed, options, user);
    }

    _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);

        // HP CHANGES SCROLLING STATUS TEXT
        if (changed.system && 'stamina' in changed.system && 'current' in changed.system.stamina) {
            const tokens = this.isToken ? [this.token] : this.getActiveTokens(true, true);
            if (!tokens.length) return;
            const pct = Math.clamp(Math.abs(options.staminaDelta) / this.system.stamina.max, 0, 1);
            for (const token of tokens) {
                if (!token.object?.visible || !token.object?.renderable) continue;
                const t = token.object;
                canvas.interface.createScrollingText(t.center, options.staminaDelta.signedString(), {
                    anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
                    // Adapt the font size relative to the Actor's HP total to emphasize more significant blows
                    fontSize: 32 + 32 * pct, // Range between [32, 64]
                    fill: options.staminaDelta > 0 ? 'green' : 'red',
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

        // add stamina
        Object.entries(this.system.stamina).forEach((entry) => rollOptions.push(`${prefix}:stamina:${entry[0]}:${entry[1]}`));
        const staminaPercentage = Math.floor((this.system.stamina.current / this.system.stamina.max) * 100);

        rollOptions.push(`${prefix}:stamina:percentage:${staminaPercentage}`);

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

        if (this.inCombat) {
            const combatants = game.combat.getCombatantsByActor(this);
            combatants.forEach((combatant) => {
                rollOptions.push(`${prefix}:combat:turns-left:${combatant.system.turns.left ?? 0}`);
            });
        }

        return rollOptions.sort();
    }
}
