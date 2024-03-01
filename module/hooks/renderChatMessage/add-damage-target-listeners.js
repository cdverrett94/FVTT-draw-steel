function registerDamageTargetListners(document, html) {
    html.querySelectorAll('.damage-target').forEach(async (element) => {
        element.addEventListener('click', async (event) => {
            const dataset = element.dataset;
            const actorId = dataset.targetUuid;

            if (!actorId) return ui.notifications.error('No target selected');
            let actor = await fromUuid(actorId);

            const oldHp = actor.system.hp.current;
            const damage = document.rolls[0].total;
            const newHp = oldHp - damage;

            await actor.update({ 'system.hp.current': newHp });
        });
    });
}

export { registerDamageTargetListners };
