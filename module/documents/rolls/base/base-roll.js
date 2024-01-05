export class MCDMRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        let actor = fromUuidSync(options.actorId);
        if (!actor) {
            const speaker = ChatMessage.implementation.getSpeaker();
            if (speaker.token) actor = game.actors.tokens[speaker.token];
            actor ??= game.actors.get(speaker.actor);
        }

        if (!data.length) data = actor?.getRollData() || {};
        options.boons = Math.abs(Number(options.boons) || 0);
        options.banes = Math.abs(Number(options.banes) || 0);
        options.impacts = Math.abs(Number(options.impacts) || 0);

        super(formula, data, options);
        this.boons = options.boons;
        this.banes = options.banes;
        this.impacts = options.impacts;
        this.actor = actor;
    }
}
