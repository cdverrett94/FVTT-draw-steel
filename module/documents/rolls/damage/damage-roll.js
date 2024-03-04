import { damageTypes } from '../../../constants.js';
import { MCDMRoll } from '../base/base-roll.js';

export class DamageRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        this.damageType = options.damageType in damageTypes ? options.damageType : 'untyped';
    }

    static CHAT_TEMPLATE = 'systems/mcdmrpg/module/documents/rolls/damage/chat-message.hbs';

    static constructFinalFormula(baseFormula, options) {
        let { boons, banes, boonBaneAdjustment, impacts } = this.getFinalBoonOrBane({ boons: options.boons, banes: options.banes, impacts: options.impacts });
        let constructedFormula = baseFormula === '0' ? '' : baseFormula;

        // Apply Boons and Banes to final roll
        let boonBaneAdjustmentSign = boonBaneAdjustment > 0 ? '+' : '-';
        if (boonBaneAdjustment != 0) constructedFormula = `${constructedFormula} ${boonBaneAdjustmentSign} ${Math.abs(boonBaneAdjustment)}d4`;
        if (impacts) constructedFormula = `${constructedFormula} + ${impacts}d8`;

        // Replace characteristic for final roll
        let characteristic = 0;
        if (options.characteristic) {
            if (Number.isNumeric(characteristic)) characteristic = Number(this.replaceFormulaData(`@${options.characteristic}`, options.actor?.system ?? {}));
        }

        // Get hero or monster bonus damage
        let bonusDamage = 0;
        if (options.actor?.type === 'hero' && options.actor?.system.kit?.system.damage && options.applyExtraDamage) {
            bonusDamage = options.actor.system.kit?.system.damage;
        } else if (options.actor?.type === 'monster' && options.actor?.system.bonusDamage && options.applyExtraDamage) {
            bonusDamage = options.actor.system.bonusDamage;
        }

        // Apply the non-rolled numbers to the final roll
        let staticDamage = characteristic + bonusDamage;
        if (staticDamage) constructedFormula = `${constructedFormula} + ${staticDamage}`;

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
                content: await renderTemplate('systems/mcdmrpg/templates/documents/chat-messages/damage-message.hbs', {
                    roll: this,
                    tooltip: await this.getTooltip(),
                    targets: game.user.targets,
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
