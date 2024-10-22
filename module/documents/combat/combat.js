export class MCDMCombat extends Combat {
    constructor(data, context) {
        data.type = 'draw-steel';
        super(data, context);
    }

    setupTurns() {
        // Determine the turn order and the current turn
        const turns = this.getTurns();
        if (this.turn !== null) this.turn = Math.clamp(this.turn, 0, turns.length - 1);

        // Update state tracking
        let c = turns[this.turn];
        this.current = {
            round: this.round,
            turn: this.turn,
            combatantId: c ? c.id : null,
            tokenId: c ? c.tokenId : null,
        };

        // One-time initialization of the previous state
        if (!this.previous) this.previous = this.current;

        // Return the array of prepared turns
        return (this.turns = turns);
    }

    getTurns() {
        const turns = [];
        for (const combatant of this.combatants.contents) {
            const numberOfTurns = combatant?.system?.turns.total ?? 1;

            for (let iterator = 0; iterator < numberOfTurns; iterator++) {
                turns.push(combatant);
            }
        }

        return turns;
    }

    get heroes() {
        const heroes = this.combatants.filter((combatant) => combatant.token.disposition === 1);
        heroes.sort((a, b) => {
            if (a.system.turns.left < b.system.turns.left) return 1;
            if (a.system.turns.left > b.system.turns.left) return -1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;

            return 0;
        });
        return heroes;
    }

    get enemies() {
        const enemies = this.combatants.filter((combatant) => combatant.token.disposition === -1);
        enemies.sort((a, b) => {
            if (a.system.turns.left < b.system.turns.left) return 1;
            if (a.system.turns.left > b.system.turns.left) return -1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;

            return 0;
        });
        return enemies;
    }

    get initiativeOrder() {
        const order = {};
        if (this.system.initiative.heroes > this.system.initiative.enemies) {
            order.heroes = this.heroes;
            order.enemies = this.enemies;
        } else {
            order.enemies = this.enemies;
            order.heroes = this.heroes;
        }
        return order;
    }

    async _onStartRound() {
        await super._onStartRound();

        const updateData = [];
        this.combatants.forEach(async (combatant) => {
            updateData.push({
                _id: combatant._id,
                system: {
                    turns: {
                        left: combatant.actor.system.combat.turns,
                    },
                },
            });
        });

        this.updateEmbeddedDocuments('Combatant', updateData);
    }
}
