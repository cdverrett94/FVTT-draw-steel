const mcdmConditions = [
    {
        img: 'icons/magic/death/grave-tombstone-glow-tan.webp',
        id: 'dead',
        _id: 'dead000000000000',
        name: 'conditions.dead',
        label: 'conditions.dead',
    },
    {
        img: 'icons/skills/wounds/blood-drip-droplet-red.webp',
        id: 'bloodied',
        _id: 'bloodied00000000',
        name: 'conditions.bloodied',
        label: 'conditions.bloodied',
    },
    {
        img: 'icons/magic/unholy/strike-body-life-soul-green.webp',
        id: 'dazed',
        _id: 'dazed00000000000',
        name: 'conditions.dazed',
        label: 'conditions.dazed',
    },
    {
        img: 'icons/magic/unholy/silhouette-robe-evil-power.webp',
        id: 'frightened',
        _id: 'frightened000000',
        name: 'conditions.frightened',
        label: 'conditions.frightened',
    },

    {
        img: 'icons/skills/melee/unarmed-punch-fist-yellow-red.webp',
        id: 'grappled',
        _id: 'grappled00000000',
        name: 'conditions.grappled',
        label: 'conditions.grappled',
        changes: [
            {
                key: 'system.speed',
                value: '0',
                mode: 5,
            },
        ],
    },
    {
        img: 'icons/magic/life/ankh-gold-blue.webp',
        id: 'ongoingdamage',
        _id: 'ongoingdamage000',
        name: 'conditions.ongoing-damage',
        label: 'conditions.ongoing-damage',
    },
    {
        img: 'icons/magic/control/silhouette-fall-slip-prone.webp',
        id: 'prone',
        _id: 'prone00000000000',
        name: 'conditions.prone',
        label: 'conditions.prone',
        changes: [
            {
                key: 'system.banes.attacker',
                value: '1',
                mode: 2,
            },
            {
                key: 'system.boons.attacked',
                value: '1',
                mode: 2,
            },
            {
                key: 'system.speed',
                value: '.5',
                mode: 1,
            },
        ],
    },
    {
        img: 'icons/magic/control/debuff-chains-shackle-movement-red.webp',
        id: 'restrained',
        _id: 'restrained000000',
        name: 'conditions.restrained',
        label: 'conditions.restrained',
        changes: [
            {
                key: 'system.banes.attacker',
                value: '1',
                mode: 2,
                priority: null,
            },
            {
                key: 'system.boons.attacked',
                value: '1',
                mode: 2,
                priority: null,
            },
        ],
    },
    {
        img: 'icons/skills/movement/feet-winged-boots-brown.webp',
        id: 'slowed',
        _id: 'slowed0000000000',
        name: 'conditions.slowed',
        label: 'conditions.slowed',
        changes: [
            {
                key: 'system.speed',
                value: '.5',
                mode: 1,
                priority: null,
            },
        ],
    },
    {
        img: 'icons/magic/control/fear-fright-white.webp',
        id: 'surprised',
        _id: 'surprised0000000',
        name: 'conditions.surprised',
        label: 'conditions.surprised',
        changes: [
            {
                key: 'system.boons.attacked',
                value: '1',
                mode: 2,
                priority: null,
            },
        ],
    },
    {
        img: 'icons/magic/control/energy-stream-link-spiral-white.webp',
        id: 'taunted',
        _id: 'taunted000000000',
        name: 'conditions.taunted',
        label: 'conditions.taunted',
    },
    {
        img: 'icons/magic/control/debuff-energy-snare-blue.webp',
        id: 'unbalanced',
        _id: 'unbalanced000000',
        name: 'conditions.unbalanced',
        label: 'conditions.unbalanced',
    },
    {
        img: 'icons/magic/control/sleep-bubble-purple.webp',
        id: 'unconscious',
        _id: 'unconscious00000',
        name: 'conditions.unconscious',
        label: 'conditions.unconscious',
        changes: [
            {
                key: 'system.speed',
                value: '0',
                mode: 5,
                priority: null,
            },
            {
                key: 'system.boons.attacked',
                value: '2',
                mode: 2,
                priority: null,
            },
        ],
        statuses: ['prone00000000000', 'prone'],
    },
    {
        img: 'icons/magic/death/hand-withered-gray.webp',
        id: 'weakened',
        _id: 'weakened00000000',
        name: 'conditions.weakened',
        label: 'conditions.weakened',
        changes: [
            {
                key: 'system.banes.attacker',
                mode: 2,
                value: '2',
                priority: null,
            },
            {
                key: 'system.banes.tests',
                mode: 2,
                value: '2',
                priority: null,
            },
        ],
    },
];

function registerStatusEffects() {
    CONFIG.statusEffects = mcdmConditions;
    CONFIG.specialStatusEffects = mcdmConditions;
}

export { mcdmConditions, registerStatusEffects };
