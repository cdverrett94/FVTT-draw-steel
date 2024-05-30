import { DamageRoll, PowerRoll } from '../../rolls/_index.js';
import { AbilityRoll } from '../../rolls/ability/ability-roll.js';

export function registerRolls() {
    CONFIG.Dice.rolls.push(DamageRoll, PowerRoll, AbilityRoll);
}
