import { MCDMRoll } from '../base/base-roll.js';

export class ResistanceRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        this.characteristic = options.characteristic;
        this.tn = options.tn;
    }

    static constructFinalFormula(baseFormula, options) {
        let { boonBaneAdjustment, impacts } = this.getFinalBoonOrBane({ boons: options.boons, banes: options.banes, impacts: options.impacts });
        let constructedFormula = baseFormula === '0' ? '' : baseFormula;

        // Apply Boons and Banes to final roll
        let boonBaneAdjustmentSign = boonBaneAdjustment > 0 ? '+' : '-';
        if (boonBaneAdjustment != 0) constructedFormula = `${constructedFormula} ${boonBaneAdjustmentSign} ${Math.abs(boonBaneAdjustment)}d4`;
        if (impacts) constructedFormula = `${constructedFormula} + ${impacts}d8`;

        // Replace characteristic for final roll
        if (options.characteristic && options.replaceCharacteristic) {
            let characteristic = 0;
            characteristic = Number(this.replaceFormulaData(`@${options.characteristic}`, options.actor?.system ?? {}));
            let characteristicSign = characteristic >= 0 ? '+' : '-';
            if (Number.isNumeric(characteristic)) constructedFormula = `${constructedFormula} ${characteristicSign} ${Math.abs(characteristic)}`;
        } else if (options.characteristic) {
            constructedFormula = `${constructedFormula} + @${options.characteristic}`;
        }

        // Remove leading plus in the event the base formula wasn't present
        constructedFormula = constructedFormula.replace(/^ ?[\+] /gm, '');

        return constructedFormula;
    }

    async toMessage(messageData = {}, { rollMode, create = true } = {}) {
        // Perform the roll, if it has not yet been rolled
        if (!this._evaluated) await this.evaluate();

        // Prepare chat data
        messageData = foundry.utils.mergeObject(
            {
                user: game.user.id,
                content: String(this.total),
                sound: CONFIG.sounds.dice,
                content: await renderTemplate('systems/mcdmrpg/templates/documents/chat-messages/resistance-message.hbs', {
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
