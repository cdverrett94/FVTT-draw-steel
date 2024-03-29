export class MCDMCombatant extends Combatant {
    constructor(data, context) {
        data.type = 'mcdmrpg';
        super(data, context);
    }

    get canPing() {
        return this.sceneId === canvas.scene?.id && game.user.hasPermission('PING_CANVAS');
    }

    get hasResource() {
        return this.resource !== null;
    }

    get numberOfTurns() {
        return this.token.actor.system.turns;
    }
}
