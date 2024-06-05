import { AbilityRoll, DamageRoll, PowerRoll, ResistanceRoll, TestRoll } from '../../rolls/_index.js';

export function registerRolls() {
    CONFIG.Dice.rolls.push(DamageRoll, PowerRoll, AbilityRoll, ResistanceRoll, TestRoll);
}
