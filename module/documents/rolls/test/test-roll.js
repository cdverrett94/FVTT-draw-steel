import { MCDMRoll } from './base-roll.js';

export class TestRoll extends MCDMRoll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
        this.characteristic = options.characteristic;
        this.skill = options.skill;
        this.subskill = options.subskill;
        this.proficient = options.proficient;
        this.tn = options.tn;
    }
}
