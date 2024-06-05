import { TIER_TEXT } from '../constants/power-tier.js';
import { AbilityRollDialog } from '../rolls/_index.js';
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
        rollOptions.push(...this.rollOptions());
        rollOptions.push(...this.parent.rollOptions());

        const rollData = {
            actor: this.parent,
            ability: this,
            title: this.name,
            characteristic: this.system.power.characteristic,
            targets: game.user.targets.reduce((targets, target) => {
                const targetActor = target.actor;
                const targetRollOptions = [...target.actor.rollOptions('target')];

                const isFlanking = this.parent.getActiveTokens(true, true).some((token) => {
                    return token.isFlanking({ target: target.document });
                });
                if (isFlanking) targetRollOptions.push('target:flanked');

                const targetModifiers = this.#getTargetModifiers(targetActor, { targetRollOptions, actorRollOptions: this.parent.rollOptions() });
                targets[targetActor.uuid] = {
                    ...targetModifiers,
                    actor: targetActor,
                    token: target.document,
                    rollOptions: targetRollOptions,
                };
                return targets;
            }, {}),
            general: {
                ...this.#getOwnerModifiers(),
                rollOptions,
            },
        };

        new AbilityRollDialog(rollData).render(true);
    }

    get isRollable() {
        if (this.system.power.isResistance) return false;

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

    #getTargetModifiers(target, { targetRollOptions, actorRollOptions } = {}) {
        let rollData = {
            edges: 0,
            banes: 0,
            bonuses: 0,
        };
        // Get Edges/Banes that apply when target is attacked
        if (target.system.edges.attacked) rollData.edges += target.system.edges.attacked;
        if (target.system.banes.attacked) rollData.banes += target.system.banes.attacked;
        actorRollOptions ??= this.parent.rollOptions();
        targetRollOptions ??= target.rollOptions('target');
        // Get Edges if attacking a creature you are frightened by
        const attackingFrightenedByPredicate = new Predicate([`actor:condition:frightened:${target.uuid}`], actorRollOptions);
        if (attackingFrightenedByPredicate.validate()) rollData.banes += 1;
        // Get Edges if attacking a creature you have frightened
        const attackingFrightenedPredicate = new Predicate([`target:condition:frightened:${this.uuid}`], targetRollOptions);
        if (attackingFrightenedPredicate.validate()) rollData.edges += 1;
        // Get Banes if attacking a creature a creature other than one that has you taunted
        const attackingNontauntedPredicate = new Predicate(['actor:condition:taunted', { not: [`actor:condition:taunted`, target.uuid] }], actorRollOptions);
        if (attackingNontauntedPredicate.validate()) rollData.banes += 1;

        const flankingPredicate = new Predicate([`target:flanked`], targetRollOptions);
        if (flankingPredicate.validate()) rollData.edges += 1;

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

    getTierEffect(tier) {
        return this.system.power.tiers[TIER_TEXT[tier]];
    }

    async toChat() {
        const templateData = {
            ability: this,
            actor: this.parent,
        };

        const systemData = {
            origin: {
                item: this.uuid,
                actor: this.parent.uuid,
            },
            isResistance: this.system.power.isResistance,
        };

        await ChatMessage.create({
            type: 'ability',
            user: game.user.id,
            system: systemData,
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/ability-message.hbs', {
                ability: this,
                actor: this.parent,
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
