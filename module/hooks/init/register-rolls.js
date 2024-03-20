import { DamageRoll, ResistanceRoll, TestRoll } from '../../rolls/_index.js';

export function registerRolls() {
    CONFIG.Dice.rolls.push(DamageRoll, ResistanceRoll, TestRoll);
}
