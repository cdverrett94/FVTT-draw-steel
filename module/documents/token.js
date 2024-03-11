export class MCDMTokenDocument extends TokenDocument {
    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        let { length, width } = this.actor.system.size;
        this.updateSource({ height: length, width });
    }
}
