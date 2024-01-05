import { damageTypes } from '../../../constants.js';
import { MCDMRoll } from '../base/base-roll.js';

export class DamageRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        Object.assign(
            this,
            this.getFinalBoonOrBane({
                boons: options.boons,
                banes: options.banes,
            })
        );

        this._formula = this.constructFormulaFromOptions(this.options.formula, options);

        this.damageType = damageTypes.includes(options.damageType) ? options.damageType : 'untyped';
    }

    constructFormulaFromOptions(formula, options) {
        let constructedFormula = formula === '0' ? '' : formula;
        let boonBaneAdjustmentSign = this.boonBaneAdjustment > 0 ? '+' : '-';

        if (this.boonBaneAdjustment != 0) constructedFormula = `${constructedFormula} ${boonBaneAdjustmentSign} ${Math.abs(this.boonBaneAdjustment)}d4`;
        if (this.impacts) constructedFormula = `${constructedFormula} + ${this.impacts}d8`;

        let characteristic = 0;
        if (this.options.characteristic) characteristic = Number(this.constructor.replaceFormulaData(`@${this.options.characteristic}`, this.actor.system));

        let bonusDamage = 0;
        if (options.actor.type === 'hero' && options.actor.system.kit?.system.damage && options.applyKitDamage) {
            bonusDamage = options.actor.system.kit?.system.damage;
        } else if (options.actor.type === 'monster' && options.actor.system.bonusDamage && options.applyKitDamage) {
            bonusDamage = options.actor.system.bonusDamage;
        }
        let staticDamage = characteristic + bonusDamage;
        if (staticDamage) constructedFormula = `${constructedFormula} + ${staticDamage}`;

        return constructedFormula.replace(/^ ?[\+\-] /gm, '');
    }

    getFinalBoonOrBane({ boons = 0, banes = 0 }) {
        boons = Math.abs(Number(boons) || 0);
        banes = Math.abs(Number(banes) || 0);
        let boonBaneAdjustment = boons - banes;
        return { boons, banes, boonBaneAdjustment };
    }

    static constructFinalFormula(formula, options) {
        if (options.boons || options.banes) {
            let boons = Math.abs(Number(options.boons) || 0);
            let banes = Math.abs(Number(options.banes) || 0);
            let boonBaneAdjustment = boons - banes;

            if (boonBaneAdjustment !== 0) formula = `${formula} ${boonBaneAdjustment > 0 ? '+' : ''} ${Math.abs(boonBaneAdjustment)}d4`;
        }

        if (options.impacts) {
            formula = `${formula} + ${options.impacts}d8`;
        }

        if (options.actor.type === 'hero' && options.actor.system.kit?.system.damage && options.applyKitDamage) {
            formula = `${formula} + ${options.actor.system.kit?.system.damage}`;
        } else if (options.actor.type === 'monster' && options.actor.system.bonusDamage && options.applyKitDamage) {
            formula = `${formula} + ${options.actor.system.bonusDamage}`;
        }

        return formula;
    }
}
