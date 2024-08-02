import { ABILITIES, DAMAGE } from '../../constants/_index.js';

export function setCSSVariables() {
    // Set Ability Type Variables
    let root = document.querySelector(':root');
    for (const category in ABILITIES.CATEGORIES) {
        root.style.setProperty(`--${category}-ability-color`, ABILITIES.CATEGORIES[category].color);
    }

    for (const type in DAMAGE.TYPES) {
        root.style.setProperty(`--${type}-damage-color`, DAMAGE.TYPES[type].color);
    }
}
