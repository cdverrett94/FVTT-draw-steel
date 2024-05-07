function createTargetDamageButton(damage, document, targetId, targetUuid) {
    const damageButton = globalThis.document.createElement('button');
    damageButton.dataset.targetUuid = targetUuid;
    damageButton.dataset.targetId = targetId;
    damageButton.dataset.damageAmount = damage.amount;
    damageButton.dataset.damageType = damage.type;
    damageButton.classList.add('apply-damage-button');
    if (document.system.targets[targetId].applied.damage) {
        damageButton.disabled = true;
        damageButton.classList.add('disabled');
        damageButton.innerText = game.i18n.format('system.rolls.damage.chatDamageButton.applied', {
            amount: damage.amount,
            type: damage.type !== 'untyped' ? ' ' + game.i18n.localize(`system.damage.types.${damage.type}.label`) : '',
        });
    } else {
        damageButton.innerText = game.i18n.format('system.rolls.damage.chatDamageButton.apply', {
            amount: damage.amount,
            type: damage.type !== 'untyped' ? ' ' + game.i18n.localize(`system.damage.types.${damage.type}.label`) : '',
        });
        registerDamageTargetListeners(damageButton, document);
    }
    return damageButton;
}

function createTargetKnockbackButton(distance, document, targetId, targetUuid, tokenUuid) {
    const knockbackButton = globalThis.document.createElement('button');
    knockbackButton.dataset.targetUuid = targetUuid;
    knockbackButton.dataset.targetId = targetId;
    knockbackButton.dataset.tokenUuid = tokenUuid;
    knockbackButton.dataset.knockbackDistance = distance;
    knockbackButton.classList.add('apply-knockback-button');
    if (document.system.targets[targetId].applied.knockback) {
        knockbackButton.disabled = true;
        knockbackButton.classList.add('disabled');
        knockbackButton.innerText = `${game.i18n.localize('system.terms.knockback.applied')} ${distance}`;
    } else {
        knockbackButton.innerText = `${game.i18n.localize('system.terms.knockback.label')} ${distance}`;
        registerKnockbackTargetListeners(knockbackButton, document);
    }
    return knockbackButton;
}

async function addButtonsToTargets(document, html) {
    if (document.type !== 'ability') return false;
    const ability = await fromUuid(document.system.origin?.item);
    html.querySelectorAll('.target-roll').forEach(async (element) => {
        const hasPermissions = document.isAuthor || document.testUserPermission(game.user, 3);
        if (!hasPermissions) return;
        const { targetUuid, targetId, tokenUuid } = element.dataset;
        const targetTier = document.system?.targets?.[targetId]?.tier;
        const damage = await ability.getDamageAtTier(targetTier);
        const knockback = await ability.getKnockbackAtTier(targetTier);
        if (damage.amount !== 0) {
            element.appendChild(createTargetDamageButton(damage, document, targetId, targetUuid));
        }
        if (knockback !== 0) {
            element.appendChild(createTargetKnockbackButton(knockback, document, targetId, targetUuid, tokenUuid));
        }
    });
}

function registerDamageTargetListeners(element, document) {
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
        updateData.system.targets[targetId] = {
            applied: {
                damage: true,
            },
        };
        await document.update(updateData);
    });
}

async function registerKnockbackTargetListeners(element, document) {
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
            updateData.system.targets[targetId] = {
                applied: {
                    knockback: true,
                },
            };
            await document.update(updateData);
        }
    });
}

export { addButtonsToTargets };
