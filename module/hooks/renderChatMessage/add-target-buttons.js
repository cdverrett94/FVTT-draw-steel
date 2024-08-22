import { DamageModification } from '../../applications/configs/damage-modification-config.js';
import { createTargetButton, setEffectApplied } from './helpers.js';

async function addButtonsToTargets(document, html) {
    if (document.type !== 'ability') return false;
    html.querySelectorAll('.target-roll .target-buttons').forEach(async (element) => {
        const hasPermissions = document.isAuthor || document.testUserPermission(game.user, 3);
        if (!hasPermissions) return;

        const { targetUuid, targetId, tokenUuid } = element.dataset;
        let targetTier = document.system?.targets?.[targetId]?.tier;

        if (targetTier === 1) targetTier = 'one';
        else if (targetTier === 2) targetTier = 'two';
        else if (targetTier === 3) targetTier = 'three';

        document.system.targets[targetId].appliedEffects?.forEach((effect, index) => {
            const isActionableType = ['damage', 'knockback'].includes(effect.type);
            if (!isActionableType) return;

            const classes = [`apply-${effect.type}-button`];
            const disabled = effect.applied;
            const dataset = { targetId, targetUuid, tokenUuid, index };
            let text;
            let registerListeners;

            if (effect.type === 'damage') {
                dataset.damageAmount = effect.amount ?? 0;
                dataset.damageType = effect.dType ?? 'untyped';

                const localizationPath = disabled ? 'system.rolls.damage.chatDamageButton.applied' : 'system.rolls.damage.chatDamageButton.apply';
                const damageTypeText = dataset.damageType !== 'untyped' ? ' ' + game.i18n.localize(`system.damage.types.${dataset.damageType}.label`) : '';

                text = game.i18n.format(localizationPath, { amount: dataset.damageAmount, type: damageTypeText });
                registerListeners = registerDamageTargetListeners;
            } else if (effect.type === 'knockback') {
                dataset.knockbackDistance = effect.distance;

                const localizationPath = disabled ? 'system.terms.knockback.applied' : 'system.terms.knockback.label';
                text = `${game.i18n.localize(localizationPath)} ${dataset.knockbackDistance}`;

                registerListeners = registerKnockbackTargetListeners;
            }

            const button = createTargetButton(document, dataset, classes, text, disabled, registerListeners);
            element.appendChild(button);
        });
    });
}

function registerDamageTargetListeners(element, document, index) {
    element.addEventListener('click', async (event) => {
        const { targetUuid, targetId, damageAmount, damageType } = element.dataset;
        if (!targetUuid) return ui.notifications.error('No target selected');
        const actor = await fromUuid(targetUuid);
        const keywords = (await fromUuid(document.system.origin.item)).system.keywords;

        const clickData = { document, target: targetId, index, actor, amount: Number(damageAmount), type: damageType, keywords };

        if (event.shiftKey) DamageButtonShiftClick(clickData);
        else DamageButtonClick(clickData);
    });
}

function registerKnockbackTargetListeners(element, document, index) {
    element.addEventListener('click', async (event) => {
        const { targetUuid, targetId, tokenUuid, knockbackDistance } = element.dataset;
        if (!targetUuid) return ui.notifications.error('No target selected');
        const token = await fromUuid(tokenUuid);
        if (!token.parent._view) return ui.notifications.error(`Target token's scene is not viewed. Please view scene ${token.parent.name}`);
        const actionTaken = await game.mcdmrpg.actions.knockback({ token: token, distance: knockbackDistance }).request();

        if (actionTaken) {
            await setEffectApplied(document, targetId, index);
        }
    });
}

async function DamageButtonShiftClick({ document, target, index, actor, amount = 0, type = 'untyped', keywords }) {
    new DamageModification({ document, target, index, actor, amount, type, keywords }).render(true);
}

export async function DamageButtonClick({ document, target, index, actor, amount = 0, type = 'untyped', keywords }) {
    await actor.applyDamage({ amount, type, keywords });

    await setEffectApplied(document, target, index);
}

export { addButtonsToTargets };
