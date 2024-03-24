import { Predicate } from '../rules/predicate.js';
import { MCDMActiveEffect } from './active-effects.js';

export class BaseItem extends Item {
    overrides = this.overrides ?? {};
    prepareBaseData() {
        const actorRules = this.system.rules?.filter((rule) => rule.affects === 'actor');
        const itemRules = this.system.rules?.filter((rule) => rule.affects === 'item');

        if (actorRules)
            this.createEffectsFromRules({ target: this.parent, name: `${this.name} Applied Actor Effects From Rules`, rules: actorRules, transfer: true });
        if (itemRules) this.createEffectsFromRules({ target: this, name: `${this.name} Applied Item Effects Fom Rules`, rules: itemRules, transfer: false });

        super.prepareBaseData();
    }

    prepareEmbeddedDocuments() {
        super.prepareEmbeddedDocuments();
        this.applyActiveEffects();
    }

    /**
     * Apply any transformations to the Item data which are caused by ActiveEffects.
     */
    applyActiveEffects() {
        const overrides = {};

        // Organize non-disabled effects by their application priority
        const changes = [];
        for (const effect of this.allApplicableEffects()) {
            if (!effect.active) continue;
            changes.push(
                ...effect.changes.map((change) => {
                    const c = foundry.utils.deepClone(change);
                    c.effect = effect;
                    c.priority = c.priority ?? c.mode * 10;
                    return c;
                })
            );
        }
        changes.sort((a, b) => a.priority - b.priority);

        // Apply all changes
        for (let change of changes) {
            if (!change.key) continue;
            const changes = change.effect.applyItem(this, change);
            Object.assign(overrides, changes);
        }

        // Expand the set of final overrides
        this.overrides = foundry.utils.expandObject(overrides);
    }

    *allApplicableEffects() {
        for (const effect of this.effects) {
            if (!effect.transfer) yield effect;
        }
    }

    createEffectsFromRules({ target, name, rules, transfer }) {
        if (rules.length && target) {
            const existingEffect = target.effects.find((effect) => effect.origin === this.uuid);
            if (existingEffect) target.effects.delete(existingEffect._id);

            const changes = rules.reduce((changes, rule) => {
                const predicate = new Predicate(rule.predicate, [...this.rollOptions(), ...this.parent?.rollOptions()]);
                if (predicate.validate() && Number.isNumeric(rule.mode)) {
                    changes.push({
                        key: rule.key,
                        mode: rule.mode,
                        value: Number.isNumeric(rule.value) ? Number(rule.value) : rule.value,
                    });
                    return changes;
                }
            }, []);
            if (!changes) return;

            const effectData = {
                name,
                _id: foundry.utils.randomID(),
                changes,
                transfer,
                origin: this.uuid,
                statuses: ['dead'],
            };
            target.effects.set(effectData._id, new MCDMActiveEffect(effectData));
        }
    }

    rollOptions(prefix = 'item') {
        const rollOptions = [];

        // add item name
        rollOptions.push(`${prefix}:${this.name.slugify()}`);

        return rollOptions;
    }
    [{ or: ['actor:class:tactician', { gte: ['actor:level', 2] }] }];
}
