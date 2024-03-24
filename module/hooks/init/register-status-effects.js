import { CONDITIONS } from '../../constants/_index.js';

function registerStatusEffects() {
    CONFIG.statusEffects = Object.values(CONDITIONS);
    CONFIG.specialStatusEffects = Object.keys(CONDITIONS);
}

export { registerStatusEffects };
