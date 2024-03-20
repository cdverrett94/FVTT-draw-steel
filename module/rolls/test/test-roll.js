import { MCDMRoll } from '../base/base-roll.js';

export class TestRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        this.characteristic = options.characteristic;
        this.skill = options.skill;
        this.subskill = options.subskill;
        this.proficient = options.proficient;
        this.tn = options.tn;
    }
    static CHAT_TEMPLATE = 'systems/mcdmrpg/templates/chat-messages/test-message.hbs';
    async toMessage(messageData = {}, { rollMode, create = true } = {}) {
        // Perform the roll, if it has not yet been rolled
        if (!this._evaluated) await this.evaluate();

        // Prepare chat data
        messageData = foundry.utils.mergeObject(
            {
                user: game.user.id,
                content: String(this.total),
                sound: CONFIG.sounds.dice,
                content: await renderTemplate(this.constructor.CHAT_TEMPLATE, {
                    roll: this,
                    tooltip: await this.getTooltip(),
                    targets: game.user.targets,
                    tn: this.tn,
                    title: messageData.headerLabel,
                }),
            },
            messageData
        );
        messageData.rolls = [this];

        // Either create the message or just return the chat data
        const cls = getDocumentClass('ChatMessage');
        const msg = new cls(messageData);

        // Either create or return the data
        if (create) return cls.create(msg.toObject(), { rollMode });
        else {
            if (rollMode) msg.applyRollMode(rollMode);
            return msg.toObject();
        }
    }
}
