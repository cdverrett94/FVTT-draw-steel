import { AbilityPowerRollDialog } from '../rolls/ability/roll-dialog.js';
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
        const rollData = {
            actor: this.parent,
            ability: this,
            targets: game.user.targets.reduce((targets, target) => {
                const targetActor = target.actor;
                const targetModifiers = this.#getTargetModifiers(targetActor);
                targets[targetActor.uuid] = {
                    ...targetModifiers,
                    actor: targetActor,
                };
                return targets;
            }, {}),
            general: {
                ...this.#getOwnerModifiers(),
            },
        };

        new AbilityPowerRollDialog(rollData).render(true);
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

    getTierEffect(tier) {
        return this.system.tiers[tier];
    }
}
