export class MCDMCombatTracker extends CombatTracker {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['mcdmrpg'],
            id: 'combat',
            template: 'systems/mcdmrpg/templates/combat/combat-tracker.hbs',
            title: 'MCDM Combat Tracker',
            scrollY: ['.directory-list'],
        });
    }

    async getData() {
        const data = await super.getData();
        const combat = this.viewed;

        if (data.hasCombat) {
            data.heroes = combat?.heroes;
            data.enemies = combat?.enemies;
            data.initiative = this.viewed.system.initiative;
            data.order = this.viewed.initiativeOrder;
            data.total = {
                heroes: data.heroes?.length ?? 0,
                enemies: data.enemies?.length ?? 0,
            };
            data.left = {
                heroes: data.heroes?.filter((hero) => !hero.system?.turnCompleted).length ?? 0,
                enemies: data.enemies?.filter((enemy) => !enemy.system?.turnCompleted).length ?? 0,
            };
        }

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        // Create new Combat encounter
        html.querySelector('.combat-create').addEventListener('click', (event) => {
            this._onCombatCreate(event);
        });

        html.querySelectorAll('.roll-initiative').forEach(async (element) => {
            element.addEventListener('click', async (event) => {
                const side = element.dataset.side;

                const updateData = {
                    system: {
                        initiative: {},
                    },
                };

                const roll = await new Roll('1d6').evaluate();
                updateData.system.initiative[side] = roll.total;
                await this.viewed.update(updateData);
                roll.toMessage({
                    flavor: side === 'heroes' ? "Heroes' Initiative" : "Enemies' Initiative",
                });

                this.render(true);
            });
        });

        html.querySelectorAll('a[data-control="toggleTurnCompleted"').forEach(async (element) => {
            element.addEventListener('click', async (event) => {
                const combatantId = element.closest('li.combatant').dataset.combatantId;
                const combatant = this.viewed.combatants.find((combatant) => combatant.id === combatantId);
                const turnCompleted = combatant.system.turnCompleted;

                await combatant.update({ system: { turnCompleted: !turnCompleted } });

                this.render(true);
            });
        });
    }

    async _onCombatCreate(event) {
        event.preventDefault();
        let scene = game.scenes.current;
        const cls = getDocumentClass('Combat');
        const combat = await cls.create({ scene: scene?.id, type: 'mcdmrpg' });
        await combat.activate({ render: false });
    }
}
