function createTargetDamageButton(damage, document, targetId, targetUuid, index) {
    const damageButton = globalThis.document.createElement('button');
    damageButton.dataset.targetUuid = targetUuid;
    damageButton.dataset.targetId = targetId;
    damageButton.dataset.damageAmount = damage.amount ?? 0;
    damageButton.dataset.damageType = damage.type;
    damageButton.classList.add('apply-damage-button');
    if (document.system.targets[targetId].appliedEffects[index].applied) {
        damageButton.disabled = true;
        damageButton.classList.add('disabled');
        damageButton.innerText = game.i18n.format('system.rolls.damage.chatDamageButton.applied', {
            amount: damage.amount ?? 0,
            type: damage.dType !== 'untyped' ? ' ' + game.i18n.localize(`system.damage.types.${damage.dType}.label`) : '',
        });
    } else {
        damageButton.innerText = game.i18n.format('system.rolls.damage.chatDamageButton.apply', {
            amount: damage.amount ?? 0,
            type: damage.dType !== 'untyped' ? ' ' + game.i18n.localize(`system.damage.types.${damage.dType}.label`) : '',
        });
        registerDamageTargetListeners(damageButton, document, index);
    }
    return damageButton;
}

function createTargetKnockbackButton(distance, document, targetId, targetUuid, tokenUuid, index) {
    const knockbackButton = globalThis.document.createElement('button');
    knockbackButton.dataset.targetUuid = targetUuid;
    knockbackButton.dataset.targetId = targetId;
    knockbackButton.dataset.tokenUuid = tokenUuid;
    knockbackButton.dataset.knockbackDistance = distance;
    knockbackButton.dataset.index = index;
    knockbackButton.classList.add('apply-knockback-button');
    if (document.system.targets[targetId].appliedEffects[index].applied) {
        knockbackButton.disabled = true;
        knockbackButton.classList.add('disabled');
        knockbackButton.innerText = `${game.i18n.localize('system.terms.knockback.applied')} ${distance}`;
    } else {
        knockbackButton.innerText = `${game.i18n.localize('system.terms.knockback.label')} ${distance}`;
        registerKnockbackTargetListeners(knockbackButton, document, index);
    }
    return knockbackButton;
}

async function addButtonsToTargets(document, html) {
    if (document.type !== 'ability') return false;
    const ability = await fromUuid(document.system.origin?.item);
    html.querySelectorAll('.target-roll .target-buttons').forEach(async (element) => {
        const hasPermissions = document.isAuthor || document.testUserPermission(game.user, 3);
        if (!hasPermissions) return;

        const { targetUuid, targetId, tokenUuid } = element.dataset;
        let targetTier = document.system?.targets?.[targetId]?.tier;

        if (targetTier === 1) targetTier = 'one';
        else if (targetTier === 2) targetTier = 'two';
        else if (targetTier === 3) targetTier = 'three';
        else if (targetTier === 4) targetTier = 'four';

        document.system.targets[targetId].appliedEffects?.forEach((effect, index) => {
            if (effect.type === 'damage') {
                element.appendChild(createTargetDamageButton(effect, document, targetId, targetUuid, index));
            } else if (effect.type === 'knockback') {
                element.appendChild(createTargetKnockbackButton(effect.distance, document, targetId, targetUuid, tokenUuid, index));
            }
        });
    });
}

function registerDamageTargetListeners(element, document, index) {
    element.addEventListener('click', async (event) => {
        const { targetUuid, targetId, damageAmount, damageType } = element.dataset;
        if (!targetUuid) return ui.notifications.error('No target selected');
        const actor = await fromUuid(targetUuid);
        await actor.applyDamage({ amount: damageAmount, type: damageType });

        const updateData = {
            system: {
                targets: {},
            },
        };

        let appliedEffects = foundry.utils.duplicate(document.system.targets[targetId].appliedEffects);
        appliedEffects[index].applied = true;
        updateData.system.targets[targetId] = {
            appliedEffects,
        };
        await document.update(updateData);
    });
}

async function registerKnockbackTargetListeners(element, document, index) {
    element.addEventListener('click', async (event) => {
        const { targetUuid, targetId, tokenUuid, knockbackDistance } = element.dataset;
        if (!targetUuid) return ui.notifications.error('No target selected');
        const actor = await fromUuid(targetUuid);
        const token = await fromUuid(tokenUuid);
        if (!token.parent._view) return ui.notifications.error(`Target token's scene is not viewed. Please view scene ${token.parent.name}`);
        const actionTaken = await game.mcdmrpg.actions.knockback({ token: token, distance: knockbackDistance }).request();

        if (actionTaken) {
            const updateData = {
                system: {
                    targets: {},
                },
            };

            let appliedEffects = foundry.utils.duplicate(document.system.targets[targetId].appliedEffects);
            appliedEffects[index].applied = true;
            updateData.system.targets[targetId] = {
                appliedEffects,
            };
            await document.update(updateData);
        }
    });
}

export { addButtonsToTargets };
