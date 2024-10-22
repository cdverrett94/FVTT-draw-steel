import { TIER_TEXT } from '../../constants/power-tier.js';
import { AbilityRollDialog } from '../../rolls/_index.js';
import { Predicate } from '../../rules/predicate.js';
import { BaseItem } from './base-item.js';

export class AbilityItem extends BaseItem {
    // getter for ability distance that also applies kit upgrades
    get distance() {
        let distance = this.system.distance;
        if (!this.isOwned || !this.parent?.kit) return distance;

        const kit = this.parent.kit;
        if (kit.system.distance === 0) return distance;

        const keywords = this.system.keywords;
        if (!keywords.includes('ranged')) return distance;

        const isWeaponRanged = kit.system.type === 'martial' && ['weapon'].every((keyword) => keywords.includes(keyword));
        const isMagicRanged = kit.system.type === 'caster' && ['magic'].every((keyword) => keywords.includes(keyword));

        if (isWeaponRanged) {
            const regexp = new RegExp(/Ranged (?<baseDistance>\d+)/gim);
            const match = regexp.exec(this.system.distance);
            if (!match) return distance;

            const { baseDistance } = match.groups;
            const calculatedDistance = Number(baseDistance) + Number(kit.system.distance);

            distance = distance.replace(regexp, `Ranged ${calculatedDistance}`);
        } else if (isMagicRanged) {
            if (keywords.includes('area')) {
                const regexp = new RegExp(/(?<shape>.+) (?<baseArea>\d+) within (?<baseDistance>\d+)/gim);
                const match = regexp.exec(this.system.distance);
                if (!match) return distance;

                const { baseDistance, baseArea, shape } = match.groups;
                const calculatedDistance = Number(baseDistance) + Number(kit.system.distance);
                const calculatedArea = Number(baseArea) + Number(kit.system.area ?? 0);

                distance = distance.replace(regexp, `${shape} ${calculatedArea} within ${calculatedDistance}`);
            } else {
                const regexp = new RegExp(/Ranged (?<baseDistance>\d+)/gim);
                const match = regexp.exec(this.system.distance);
                if (!match) return distance;

                const { baseDistance } = match.groups;
                const calculatedDistance = Number(baseDistance) + Number(kit.system.distance);

                distance = distance.replace(regexp, `Ranged ${calculatedDistance}`);
            }
        }

        return distance;
    }

    // getter for ability power roll that also applies kit damage
    get power() {
        const power = foundry.utils.duplicate(this.system.power);
        if (!this.system.power.hasRoll || !this.isOwned) return power;

        const kitDamageBonus = this.kitDamageBonus;

        for (const tier in power.tiers) {
            let tierIndex = 0;
            switch (tier) {
                case 'one':
                    tierIndex = 0;
                    break;
                case 'two':
                    tierIndex = 1;
                    break;
                case 'three':
                    tierIndex = 2;
                    break;
                default:
                    tierIndex = 0;
                    break;
            }

            const damageIndex = power.tiers[tier].findIndex((effect) => effect.type === 'damage');
            if (damageIndex === -1) continue;

            power.tiers[tier][damageIndex].amount = power.tiers[tier][damageIndex].amount + kitDamageBonus[tierIndex];
        }

        power.characteristic = '';
        for (const characteristic of power.characteristics) {
            if (power.characteristic === '') power.characteristic = characteristic;

            const characteristics = this.parent.system.characteristics;
            if (characteristics[characteristic] > characteristics[power.characteristic]) power.characteristic = characteristic;
        }

        return power;
    }

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
            characteristic: this.power.characteristic,
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
        if (this.isResistance) return false;

        if (this.power.tiers.one.length || this.power.tiers.two.length || this.power.tiers.three.length) return true;
        else return false;
    }

    get isResistance() {
        return this.keywordsIncludes(['resistance']);
    }

    get doesDamage() {
        const power = this.system.power;
        let doesDamage = false;
        for (const tier in power.tiers) {
            doesDamage = power.tiers[tier].some((effect) => effect.type === 'damage');
            if (doesDamage) break;
        }

        return doesDamage;
    }

    #getOwnerModifiers() {
        const rollData = {
            edges: 0,
            banes: 0,
            bonuses: 0,
        };
        const parent = this.parent;
        if (!parent) return rollData;

        if (parent.system.banes.attacker) rollData.banes += Number(parent.system.banes.attacker);
        if (parent.system.edges.attacker) rollData.edges += Number(parent.system.edges.attacker);
        if (parent.system.bonuses.attacker) rollData.bonuses += Number(parent.system.bonuses.attacker);

        if (this.isResistance && parent.system.banes.resistance) rollData.banes += Number(parent.system.banes.resistance);
        if (this.isResistance && parent.system.edges.resistance) rollData.edges += Number(parent.system.edges.resistance);
        if (this.isResistance && parent.system.bonuses.resistance) rollData.bonuses += Number(parent.system.bonuses.resistance);
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
        return this.power.tiers[TIER_TEXT[tier]];
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
            isResistance: this.isResistance,
        };

        await ChatMessage.create({
            type: 'ability',
            user: game.user.id,
            system: systemData,
            content: await renderTemplate('systems/draw-steel/templates/chat-messages/ability-message.hbs', {
                ability: this,
                actor: this.parent,
            }),
        });
    }

    // getter for the parsed tier text to be used in html templates
    get tierText() {
        return {
            one: this.parseTierText('one'),
            two: this.parseTierText('two'),
            three: this.parseTierText('three'),
        };
    }

    // convert power roll tier object to string
    parseTierText(tier) {
        const tierEffects = this.power.tiers[tier];
        const effectsText = [];

        tierEffects.forEach((effect, index) => {
            if (effect.type === 'damage') effectsText.push(this.parseDamageEffect(effect, index, tier));
            else if (effect.type === 'knockback') effectsText.push(this.parseKnockbackEffect(effect));
            else if (effect.type === 'other') effectsText.push(effect.description);
        });

        return effectsText.join('; ');
    }

    // parse tier damage effect into string
    parseDamageEffect(effect, index) {
        let damageTypeText = '';
        effect.type ??= 'untyped';
        if (effect.dType !== 'untyped') damageTypeText = ' ' + game.i18n.localize(`system.damage.types.${effect.dType}.label`);
        return game.i18n.format('system.rolls.damage.linkLabel', {
            amount: effect.amount ?? 0,
            type: damageTypeText,
        });
    }

    //parse tier knockback effect into string
    parseKnockbackEffect(effect) {
        return game.i18n.format('system.terms.knockback.linkLabel', {
            subtype: effect.subtype,
            distance: effect.distance ?? 0,
        });
    }

    // get the appropriate kit damage bonus based on the kit type and ability keywords
    get kitDamageBonus() {
        if (!this.isOwned || !this.parent?.kit) return [0, 0, 0];
        let bonusType = null;

        if (this.keywordsIncludes(['weapon', 'melee'])) bonusType = 'melee';
        else if (this.keywordsIncludes(['weapon', 'ranged'])) bonusType = 'range';
        else if (this.keywordsIncludes(['magic'])) bonusType = 'magic';
        if (bonusType === null) return [0, 0, 0];

        const kit = this.parent.kit;
        const bonuses = kit.system.damage[bonusType];
        return bonuses.some((bonus) => bonus != 0) ? kit.system.damage[bonusType] : [0, 0, 0];
    }

    keywordsIncludes(array) {
        const keywords = this.system.keywords;
        return array.every((keyword) => keywords.includes(keyword));
    }
}
