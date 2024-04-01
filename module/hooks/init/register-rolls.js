import { DamageRoll, PowerRoll } from '../../rolls/_index.js';

export function registerRolls() {
    CONFIG.Dice.rolls.push(DamageRoll, PowerRoll);
}
