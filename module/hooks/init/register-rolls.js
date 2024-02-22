import { DamageRoll } from '../../documents/rolls/damage/damage-roll.js';
import { ResistanceRoll } from '../../documents/rolls/resistance/resistance-roll.js';
import { TestRoll } from '../../documents/rolls/test/test-roll.js';

export function registerRolls() {
    CONFIG.Dice.rolls.push(DamageRoll, ResistanceRoll, TestRoll);
}
