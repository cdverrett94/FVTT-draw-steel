import { Predicate } from '../../rules/predicate.js';
import { MCDMActiveEffect } from '../active-effects.js';

export class BaseItem extends Item {
    overrides = this.overrides ?? {};
    appliedEffects = false;

    prepareBaseData() {
        const actorRules = this.system.rules?.filter((rule) => rule.affects === 'actor') ?? [];
        const itemRules = this.system.rules?.filter((rule) => rule.affects === 'item') ?? [];

        this.createEffectsFromRules({ target: this.parent, name: `${game.i18n.localize('DOCUMENT.Item')}: ${this.name}`, rules: actorRules });
        this.createEffectsFromRules({ target: this, name: `${game.i18n.localize('DOCUMENT.Item')}: ${this.name}`, rules: itemRules });

        super.prepareBaseData();
    }

    prepareEmbeddedDocuments() {
        super.prepareEmbeddedDocuments();
        this.applyActiveEffects();
    }

    createEffectsFromRules({ target, name, rules, transfer }) {
        const existingEffect = target?.effects.find((effect) => effect.origin === this.uuid);
        if (existingEffect) target?.effects.delete(existingEffect._id);

        if (rules.length) {
            const changes = rules.reduce((changes, rule) => {
                const predicate = new Predicate(rule.predicate, [...this.rollOptions(), ...this.parent?.rollOptions()]);
                let value = rule.value;
                if (predicate.validate() && Number.isNumeric(rule.mode)) {
                    if (rule.value.startsWith('@')) {
                        if (rule.value.startsWith('@actor') && this.parent) {
                            const path = rule.value.split('@actor.')[1];
                            value = foundry.utils.getProperty(this.parent, path) ?? value;
                        } else if (rule.value.startsWith('@item')) {
                            const path = rule.value.split('@item.')[1];
                            value = foundry.utils.getProperty(this, path) ?? value;
                        }
                    }
                    changes.push({
                        key: rule.key,
                        mode: rule.mode,
                        value: Number.isNumeric(value) ? Number(value) : value,
                    });
                    return changes;
                }
            }, []);
            if (!changes) return;

            const effectData = {
                _id: foundry.utils.randomID(),
                name,
                changes,
                origin: this.uuid,
                transfer: false,
            };
            target?.effects.set(effectData._id, new MCDMActiveEffect(effectData));
        }
    }

    rollOptions(prefix = 'item') {
        const rollOptions = [];

        // add item name
        rollOptions.push(`${prefix}:${this.name.slugify()}`);

        return rollOptions;
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

        this.appliedEffects = true;
    }

    *allApplicableEffects() {
        for (const effect of this.effects) {
            if (!effect.transfer) yield effect;
        }
    }

    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);

        if (!this.isOwned || this.system.grantedFeatures.length === 0) return;

        const createData = [];
        for (let index = 0; index < this.system.grantedFeatures.length; index++) {
            const item = fromUuidSync(this.system.grantedFeatures[index]);
            createData.push(item.toObject());
        }

        Item.implementation.create(createData, { parent: this.parent });
    }
}
