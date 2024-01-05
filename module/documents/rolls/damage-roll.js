import { damageTypes } from '../../constants.js';
import { MCDMRoll } from './base-roll.js';

export class DamageRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        this.damageType = damageTypes.includes(options.damageType) ? options.damageType : 'untyped';
    }

    static constructFinalFormula(formula, options) {
        formula = MCDMRoll.constructFinalFormula(formula, options);

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
