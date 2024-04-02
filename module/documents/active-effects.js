export class MCDMActiveEffect extends ActiveEffect {
    static async fromStatusEffect(statusId, options = {}) {
        const status = CONFIG.statusEffects.find((e) => e.id === statusId);
        if (!status) throw new Error(`Invalid status ID "${statusId}" provided to ActiveEffect#fromStatusEffect`);
        /** @deprecated since v12 */
        for (const [oldKey, newKey] of Object.entries({ label: 'name', icon: 'img' })) {
            if (!(newKey in status) && oldKey in status) {
                const msg = `StatusEffectConfig#${oldKey} has been deprecated in favor of StatusEffectConfig#${newKey}`;
                foundry.utils.logCompatibilityWarning(msg, { since: 12, until: 14, once: true });
            }
        }
        let { id, label, icon, hud, changes, ...effectData } = foundry.utils.deepClone(status);
        effectData.name = game.i18n.localize(effectData.name ?? /** @deprecated since v12 */ label);
        effectData.img ??= /** @deprecated since v12 */ icon;
        effectData.statuses = Array.from(new Set([id, ...(effectData.statuses ?? [])]));
        effectData.changes = changes ?? [];

        if (effectData.statuses.length > 1 && !status._id) {
            throw new Error('Status effects with implicit statuses must have a static _id');
        }
        return ActiveEffect.implementation._fromStatusEffect(statusId, effectData, options);
    }

    _applyMultiply(actor, change, current, delta, changes) {
        let update;
        const ct = foundry.utils.getType(current);
        switch (ct) {
            case 'boolean':
                update = current && delta;
                break;
            case 'number':
                update = Math.floor(current * delta);
                break;
        }
        changes[change.key] = update;
    }

    _applyUpgrade(actor, change, current, delta, changes) {
        let update;
        const ct = foundry.utils.getType(current);
        switch (ct) {
            case 'boolean':
            case 'number':
                if (change.mode === CONST.ACTIVE_EFFECT_MODES.UPGRADE && delta >= current) update = delta;
                else if (change.mode === CONST.ACTIVE_EFFECT_MODES.DOWNGRADE && delta <= current) update = delta;
                break;
        }
        changes[change.key] = update;
    }

    applyItem(item, change) {
        // Determine the data type of the target field
        const current = foundry.utils.getProperty(item._source, change.key) ?? null;
        let target = current;
        if (current === null) {
            const model = game.model.Item[item.type] || {};
            target = foundry.utils.getProperty(model, change.key) ?? null;
        }
        let targetType = foundry.utils.getType(target);

        // Cast the effect change value to the correct type
        let delta;
        try {
            if (targetType === 'Array') {
                const innerType = target.length ? foundry.utils.getType(target[0]) : 'string';
                delta = this._castArray(change.value, innerType);
            } else delta = this._castDelta(change.value, targetType);
        } catch (err) {
            console.warn(`Item [${item.id}] | Unable to parse active effect change for ${change.key}: "${change.value}"`);
            return;
        }
        // Apply the change depending on the application mode
        const modes = CONST.ACTIVE_EFFECT_MODES;
        const changes = {};
        switch (change.mode) {
            case modes.ADD:
                this._applyAdd(item, change, current, delta, changes);
                break;
            case modes.MULTIPLY:
                this._applyMultiply(item, change, current, delta, changes);
                break;
            case modes.OVERRIDE:
                this._applyOverride(item, change, current, delta, changes);
                break;
            case modes.UPGRADE:
            case modes.DOWNGRADE:
                this._applyUpgrade(item, change, current, delta, changes);
                break;
            default:
                this._applyCustom(item, change, current, delta, changes);
                break;
        }

        // Apply all changes to the Item data
        foundry.utils.mergeObject(item, changes);

        return changes;
    }
}
