import { CONDITIONS } from '../../constants/conditions.js';

function registerStatusEffects() {
    CONFIG.statusEffects = Object.values(CONDITIONS);
    CONFIG.specialStatusEffects = Object.values(CONDITIONS);
}

export { registerStatusEffects };
