export class MCDMChatMessage extends ChatMessage {
    async getHTML() {
        // Determine some metadata
        const data = this.toObject(false);
        data.content = await TextEditor.enrichHTML(this.content, { rollData: this.getRollData(), messageData: this.system });
        const isWhisper = this.whisper.length;

        // Construct message data
        const messageData = {
            message: data,
            user: game.user,
            author: this.author,
            alias: this.alias,
            cssClass: [
                this.style === CONST.CHAT_MESSAGE_STYLES.IC ? 'ic' : null,
                this.style === CONST.CHAT_MESSAGE_STYLES.EMOTE ? 'emote' : null,
                isWhisper ? 'whisper' : null,
                this.blind ? 'blind' : null,
            ].filterJoin(' '),
            isWhisper: this.whisper.length,
            canDelete: game.user.isGM, // Only GM users are allowed to have the trash-bin icon in the chat log itself
            whisperTo: this.whisper
                .map((u) => {
                    let user = game.users.get(u);
                    return user ? user.name : null;
                })
                .filterJoin(', '),
        };

        // Render message data specifically for ROLL type messages
        if (this.isRoll) await this._renderRollContent(messageData);

        // Define a border color
        if (this.style === CONST.CHAT_MESSAGE_STYLES.OOC) messageData.borderColor = this.author?.color.css;

        // Render the chat message
        let html = await renderTemplate(CONFIG.ChatMessage.template, messageData);
        html = $(html);

        // Flag expanded state of dice rolls
        if (this._rollExpanded) html.find('.dice-tooltip').addClass('expanded');
        Hooks.call('renderChatMessage', this, html, messageData);
        return html;
    }
}
