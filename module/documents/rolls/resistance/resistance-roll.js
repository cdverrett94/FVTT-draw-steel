import { MCDMRoll } from '../base/base-roll.js';

export class ResistanceRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        this.characteristic = options.characteristic;
        this.tn = options.tn;
    }

    static constructFinalFormula(formula, options) {
        formula = MCDMRoll.constructFinalFormula(formula, options);
        return formula;
    }
}
