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

    apply(actor, change) {
        // Allow roll data and math in active effect value
        const rollData = actor.getRollData();
        const formula = Roll.replaceFormulaData(change.value, rollData);
        let newValue;
        try {
            newValue = Roll.safeEval(formula);
        } catch (err) {}

        change.value = newValue ?? change.value;

        super.apply(actor, change);
    }
}
