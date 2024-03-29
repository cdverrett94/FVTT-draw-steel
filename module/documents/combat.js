export class MCDMCombat extends Combat {
    constructor(data, context) {
        data.type = 'mcdmrpg';
        super(data, context);
    }

    get heroes() {
        const heroes = this.combatants.filter((combatant) => combatant.token.disposition === 1);
        heroes.sort((a, b) => {
            if (a.system.turnCompleted < b.system.turnCompleted) return -1;
            if (a.system.turnCompleted > b.system.turnCompleted) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;

            return 0;
        });
        return heroes;
    }

    get enemies() {
        const enemies = this.combatants.filter((combatant) => combatant.token.disposition === -1);
        enemies.sort((a, b) => {
            if (a.system.turnCompleted < b.system.turnCompleted) return -1;
            if (a.system.turnCompleted > b.system.turnCompleted) return 1;
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

    async nextRound() {
        this.combatants.forEach(async (combatant) => {
            await combatant.update({ system: { turnCompleted: false } });
        });

        return super.nextRound();
    }
}
