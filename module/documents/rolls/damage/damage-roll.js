import { damageTypes } from '../../../constants.js';
import { MCDMRoll } from '../base/base-roll.js';

export class DamageRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        this.damageType = damageTypes.includes(options.damageType) ? options.damageType : 'untyped';
    }

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
        if (options.actor.type === 'hero' && options.actor.system.kit?.system.damage && options.applyKitDamage) {
            bonusDamage = options.actor.system.kit?.system.damage;
        } else if (options.actor.type === 'monster' && options.actor.system.bonusDamage && options.applyKitDamage) {
            bonusDamage = options.actor.system.bonusDamage;
        }

        // Apply the non-rolled numbers to the final roll
        let staticDamage = characteristic + bonusDamage;
        if (staticDamage) constructedFormula = `${constructedFormula} + ${staticDamage}`;

        // Remove leading plus in the event the base formula wasn't present
        constructedFormula = constructedFormula.replace(/^ ?[\+] /gm, '');

        return constructedFormula;
    }
}
