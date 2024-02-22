export function registerStatusEffects() {
    const statusEffects = [
        {
            icon: 'icons/magic/death/grave-tombstone-glow-tan.webp',
            id: 'dead',
            name: 'conditions.dead',
            label: 'conditions.dead',
        },
        {
            icon: 'icons/skills/wounds/blood-drip-droplet-red.webp',
            id: 'bloodied',
            name: 'conditions.bloodied',
            label: 'conditions.bloodied',
        },
        {
            icon: 'icons/magic/unholy/strike-body-life-soul-green.webp',
            id: 'dazed',
            name: 'conditions.dazed',
            label: 'conditions.dazed',
        },
        {
            icon: 'icons/magic/unholy/silhouette-robe-evil-power.webp',
            id: 'frightened',
            name: 'conditions.frightened',
            label: 'conditions.frightened',
        },

        {
            icon: 'icons/skills/melee/unarmed-punch-fist-yellow-red.webp',
            id: 'grappled',
            name: 'conditions.grappled',
            label: 'conditions.grappled',
        },
        {
            icon: 'icons/magic/life/ankh-gold-blue.webp',
            id: 'ongoing-damage',
            name: 'conditions.ongoing-damage',
            label: 'conditions.ongoing-damage',
        },
        {
            icon: 'icons/magic/control/silhouette-fall-slip-prone.webp',
            id: 'prone',
            name: 'conditions.prone',
            label: 'conditions.prone',
        },
        {
            icon: 'icons/magic/control/debuff-chains-shackle-movement-red.webp',
            id: 'restrained',
            name: 'conditions.restrained',
            label: 'conditions.restrained',
        },
        {
            icon: 'icons/skills/movement/feet-winged-boots-brown.webp',
            id: 'slowed',
            name: 'conditions.slowed',
            label: 'conditions.slowed',
        },
        {
            icon: 'icons/magic/control/fear-fright-white.webp',
            id: 'surprised',
            name: 'conditions.surprised',
            label: 'conditions.surprised',
        },
        {
            icon: 'icons/magic/control/energy-stream-link-spiral-white.webp',
            id: 'taunted',
            name: 'conditions.taunted',
            label: 'conditions.taunted',
        },
        {
            icon: 'icons/magic/control/debuff-energy-snare-blue.webp',
            id: 'unbalanced',
            name: 'conditions.unbalanced',
            label: 'conditions.unbalanced',
        },
        {
            icon: 'icons/magic/control/sleep-bubble-purple.webp',
            id: 'unconscious',
            name: 'conditions.unconscious',
            label: 'conditions.unconscious',
        },
        {
            icon: 'icons/magic/death/hand-withered-gray.webp',
            id: 'weakened',
            name: 'conditions.weakened',
            label: 'conditions.weakened',
        },
    ];

    CONFIG.statusEffects = statusEffects;
    CONFIG.specialStatusEffects = statusEffects;
}
