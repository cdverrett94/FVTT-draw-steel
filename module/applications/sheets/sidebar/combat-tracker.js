export class MCDMCombatTracker extends CombatTracker {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['draw-steel'],
            id: 'combat',
            template: 'systems/draw-steel/templates/combat/combat-tracker.hbs',
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
                heroes: data.heroes?.reduce((total, hero) => (total += hero.system.turns.total ?? 0), 0),
                enemies: data.enemies?.reduce((total, enemy) => (total += enemy.system.turns.total ?? 0), 0),
            };
            data.left = {
                heroes: data.heroes?.reduce((total, hero) => (total += hero.system.turns.left ?? 0), 0),
                enemies: data.enemies?.reduce((total, enemy) => (total += enemy.system.turns.left ?? 0), 0),
            };
        }

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        for (const element of html.querySelectorAll('.roll-initiative')) {
            element.addEventListener('click', async (event) => {
                const side = element.dataset.side;

                const updateData = {
                    system: {
                        initiative: {},
                    },
                };

                const roll = await new Roll('1d10').evaluate();
                updateData.system.initiative[side] = roll.total;
                await this.viewed.update(updateData);
                roll.toMessage({
                    flavor: side === 'heroes' ? "Heroes' Initiative" : "Enemies' Initiative",
                });

                this.render(true);
            });
        }

        for (const element of html.querySelectorAll('a[data-control="markTurnTaken"]:not(.active)')) {
            element.addEventListener('click', async (event) => {
                const combatantId = element.closest('li.combatant').dataset.combatantId;
                const combatant = this.viewed.combatants.find((combatant) => combatant.id === combatantId);

                await this.updateCombatant(combatant);
                const combat = await this.viewed.nextTurn();

                //await this.render(true);
            });
        }
    }

    async updateCombatant(combatant) {
        const turnsLeft = Math.max(combatant.system.turns.left - 1, 0);

        const updateData = {
            system: {
                turns: {
                    left: turnsLeft,
                },
            },
        };

        await combatant.update(updateData, { turnEvents: false });
    }

    async _onCombatCreate(event) {
        event.preventDefault();
        let scene = game.scenes.current;
        const cls = getDocumentClass('Combat');
        const combat = await cls.create({ scene: scene?.id, type: 'draw-steel' });
        await combat.activate({ render: false });
    }
}
