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
        if (!this.isRollable || !this.parent) return;

        const rollOptions = [];
        rollOptions.push(...this.parent.rollOptions());
        game.user.targets.forEach((target) => {
            rollOptions.push(...target.actor.rollOptions('target'));
            const isFlanking = this.parent.getActiveTokens(true, true).some((token) => {
                return token.isFlanking({ target: target.document });
            });
            if (isFlanking) rollOptions.push('target:flanked');
        });

        rollOptions.push(...this.rollOptions());

        const rollData = {
            actor: this.parent,
            ability: this,
            title: this.name,
            characteristic: this.system.power.characteristic,
            targets: game.user.targets.reduce((targets, target) => {
                const targetActor = target.actor;
                const targetRollOptions = [...rollOptions];
                targetRollOptions.push(...target.actor.rollOptions('target'));

                const isFlanked = this.parent.getActiveTokens(true, true).some((token) => {
                    return token.isFlanking({ target: target.document });
                });
                if (isFlanked) targetRollOptions.push('target:flanked');

                const targetModifiers = this.#getTargetModifiers(targetActor);
                targets[targetActor.uuid] = {
                    ...targetModifiers,
                    actor: targetActor,
                    token: target.document,
                    rollOptions: [...targetRollOptions],
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
        if (this.system.power.tiers.one.length || this.system.power.tiers.two.length || this.system.power.tiers.three.length) return true;
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
            bonuses: 0,
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

    get tierText() {
        return {
            one: this.parseTierText('one'),
            two: this.parseTierText('two'),
            three: this.parseTierText('three'),
            four: this.parseTierText('four'),
        };
    }

    parseTierText(tier) {
        const tierEffects = this.system.power.tiers[tier];
        const effectsText = [];

        tierEffects.forEach((effect) => {
            if (effect.type === 'damage') effectsText.push(this.parseDamageEffect(effect));
            else if (effect.type === 'knockback') effectsText.push(this.parseKnockbackEffect(effect));
            else if (effect.type === 'other') effectsText.push(effect.description);
        });

        return effectsText.join(', ');
    }

    parseDamageEffect(effect) {
        let damageTypeText = '';
        effect.type ??= 'untyped';
        if (effect.dType !== 'untyped') damageTypeText = ' ' + game.i18n.localize(`system.damage.types.${effect.dType}.label`);
        return game.i18n.format('system.rolls.damage.linkLabel', {
            amount: effect.amount ?? 0,
            type: damageTypeText,
        });
    }

    parseKnockbackEffect(effect) {
        return game.i18n.format('system.terms.knockback.linkLabel', {
            distance: effect.distance ?? 0,
        });
    }
}
