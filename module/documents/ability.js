import { _getEnrichedOptions } from '../enrichers/helpers.js';
import { AbilityPowerRollDialog } from '../rolls/_index.js';
import { Predicate } from '../rules/predicate.js';
import { BaseItem } from './base-item.js';

export class AbilityItem extends BaseItem {
    rollOptions(prefix = 'ability') {
        const rollOptions = super.rollOptions(prefix);

        // add keywords
        this.system.keywords.forEach((keyword) => rollOptions.push(`${prefix}:keyword:${keyword}`));
        // add type
        rollOptions.push(`${prefix}:type:${this.system.type}`);

        return rollOptions;
    }

    roll() {
        if (!this.isRollable) return;

        const rollData = {
            actor: this.parent,
            ability: this,
            title: this.name,
            characteristic: this.system.power.characteristic,
            targets: game.user.targets.reduce((targets, target) => {
                const targetActor = target.actor;
                const targetModifiers = this.#getTargetModifiers(targetActor);
                targets[targetActor.uuid] = {
                    ...targetModifiers,
                    actor: targetActor,
                    token: target.document,
                };
                return targets;
            }, {}),
            general: {
                ...this.#getOwnerModifiers(),
            },
        };

        new AbilityPowerRollDialog(rollData).render(true);
    }

    get isRollable() {
        if (this.system.power.tiers.one || this.system.power.tiers.two || this.system.power.tiers.three) return true;
        else return false;
    }

    #getOwnerModifiers() {
        const rollData = {
            edges: 0,
            banes: 0,
        };
        if (this.parent?.system.banes.attacker) rollData.banes += Number(this.parent.system.banes.attacker);
        if (this.parent?.system.edges.attacker) rollData.edges += Number(this.parent.system.edges.attacker);
        return rollData;
    }

    #getTargetModifiers(target) {
        let rollData = {
            edges: 0,
            banes: 0,
        };
        // Get Edges/Banes that apply when target is attacked
        if (target.system.edges.attacked) rollData.edges += target.system.edges.attacked;
        if (target.system.banes.attacked) rollData.banes += target.system.banes.attacked;
        const actorRollOptions = this.parent.rollOptions();
        const targetRollOptions = target.rollOptions('target');
        // Get Edges if attacking a creature you are frightened by
        const attackingFrightenedByPredicate = new Predicate([`actor:condition:frightened:${target.uuid}`], actorRollOptions);
        if (attackingFrightenedByPredicate.validate()) rollData.banes += 1;
        // Get Edges if attacking a creature you have frightened
        const attackingFrightenedPredicate = new Predicate([`target:condition:frightened:${this.uuid}`], targetRollOptions);
        if (attackingFrightenedPredicate.validate()) rollData.edges += 1;
        // Get Banes if attacking a creature a creature other than one that has you taunted
        const attackingNontauntedPredicate = new Predicate(['actor:condition:taunted', { not: [`actor:condition:taunted`, target.uuid] }], actorRollOptions);
        if (attackingNontauntedPredicate.validate()) rollData.banes += 1;
        return rollData;
    }

    get appliesKitDamage() {
        return true;
    }

    get kitDamage() {
        if (!this.appliesKitDamage || !this.isOwned) return 0;

        const kitDamage = this.parent.type === 'hero' ? this.parent.kit.system.damage : this.parent.system.bonusDamage;

        return kitDamage;
    }

    convertTierNumberToWord(tier) {
        if (tier === 1) tier = 'one';
        else if (tier === 2) tier = 'two';
        else if (tier === 3) tier = 'three';
        else if (tier === 4) tier = 'four';

        return tier;
    }

    getTierEffect(tier) {
        tier = this.convertTierNumberToWord(tier);
        return this.system.power.tiers[tier];
    }

    async toChat() {
        await ChatMessage.create({
            user: game.user.id,
            flags: {
                mcdmrpg: {
                    ability: this,
                },
            },
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/ability-message.hbs', {
                ability: this,
            }),
        });
    }

    async getDamageAtTier(tier) {
        tier = this.convertTierNumberToWord(tier);
        const regex = new RegExp(/@(?<enrichType>Damage)\[(?<damageAmount>[^\]\|]+)(?:\|*(?<config>[^\[\]]*))\]/, 'gi');
        if (this.system.power.tiers[tier].match(regex)) {
            const match = regex.exec(this.system.power.tiers[tier]);
            const data = await _getEnrichedOptions(match, { item: this });
            return data.damage;
        }
        return {
            amount: 0,
            type: 'untyped',
        };
    }

    async getKnockbackAtTier(tier) {
        tier = this.convertTierNumberToWord(tier);
        const regex = new RegExp(/@(?<enrichType>Knockback)\[(?<distance>\d+)\]/, 'gi');
        if (this.system.power.tiers[tier].match(regex)) {
            const match = regex.exec(this.system.power.tiers[tier]);
            const data = await _getEnrichedOptions(match, { item: this });
            return data.distance;
        }
        return 0;
    }
}
