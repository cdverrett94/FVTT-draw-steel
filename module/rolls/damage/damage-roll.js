import { DAMAGE } from '../../constants/_index.js';

export class DamageRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        this.damageType = options.damageType in DAMAGE.TYPES ? options.damageType : 'untyped';
    }
    static type = 'damage';

    get isCritical() {
        return this.terms.find((term) => term.formula === '2d6')?.total >= 11;
    }

    static CHAT_TEMPLATE = 'systems/draw-steel/templates/chat-messages/damage-message.hbs';

    async toMessage(messageData = {}, { rollMode, create = true } = {}) {
        // Perform the roll, if it has not yet been rolled
        if (!this._evaluated) await this.evaluate();

        const target = await fromUuid(messageData.target);

        // Prepare chat data
        messageData = foundry.utils.mergeObject(
            {
                user: game.user.id,
                content: String(this.total),
                sound: CONFIG.sounds.dice,
                content: await renderTemplate(this.constructor.CHAT_TEMPLATE, {
                    roll: this,
                    tooltip: await this.getTooltip(),
                    title: messageData.headerLabel,
                    target,
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
