function registerDamageTargetListners(document, html) {
    html.querySelectorAll('.target button').forEach(async (element) => {
        element.addEventListener('click', async (event) => {
            const { targetId, damageAmount } = element.dataset;

            if (!targetId) return ui.notifications.error('No target selected');
            const token = await fromUuid(targetId);
            const actor = token.actor;

            await actor.applyDamage({ amount: damageAmount });
        });
    });
}

export { registerDamageTargetListners };
