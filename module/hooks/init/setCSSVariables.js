import { ABILITIES, DAMAGE } from '../../constants/_index.js';

export function setCSSVariables() {
    // Set Ability Type Variables
    let root = document.querySelector(':root');
    for (const type in ABILITIES.TYPES) {
        root.style.setProperty(`--${type}-ability-color`, ABILITIES.TYPES[type].color);
    }

    for (const type in DAMAGE.TYPES) {
        root.style.setProperty(`--${type}-damage-color`, DAMAGE.TYPES[type].color);
    }
}
