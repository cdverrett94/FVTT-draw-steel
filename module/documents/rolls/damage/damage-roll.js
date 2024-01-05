import { damageTypes } from '../../../constants.js';
import { MCDMRoll } from '../base/base-roll.js';

export class DamageRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        // Add this.boons, this.banes, this.boonBaneAdjustment
        Object.assign(
            this,
            this.getFinalBoonOrBane({
                boons: options.boons,
                banes: options.banes,
            })
        );

        this._formula = this.constructFormulaFromOptions(this.options.baseFormula, options);

        this.damageType = damageTypes.includes(options.damageType) ? options.damageType : 'untyped';
    }

    constructFormulaFromOptions(formula, options) {
        let constructedFormula = formula === '0' ? '' : formula;

        // Apply Boons and Banes to final roll
        let boonBaneAdjustmentSign = this.boonBaneAdjustment > 0 ? '+' : '-';
        if (this.boonBaneAdjustment != 0) constructedFormula = `${constructedFormula} ${boonBaneAdjustmentSign} ${Math.abs(this.boonBaneAdjustment)}d4`;
        if (this.impacts) constructedFormula = `${constructedFormula} + ${this.impacts}d8`;

        // Replace characteristic for final roll
        let characteristic = 0;
        if (this.options.characteristic) characteristic = Number(this.constructor.replaceFormulaData(`@${this.options.characteristic}`, this.actor.system));

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

    getFinalBoonOrBane({ boons = 0, banes = 0 }) {
        boons = Math.abs(Number(boons) || 0);
        banes = Math.abs(Number(banes) || 0);
        let boonBaneAdjustment = boons - banes;
        return { boons, banes, boonBaneAdjustment };
    }
}
