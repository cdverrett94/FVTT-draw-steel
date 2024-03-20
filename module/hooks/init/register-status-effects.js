import { CONDITIONS } from '../../constants/_index.js';

function registerStatusEffects() {
    CONFIG.statusEffects = Object.values(CONDITIONS);
    CONFIG.specialStatusEffects = Object.values(CONDITIONS);
}

export { registerStatusEffects };
