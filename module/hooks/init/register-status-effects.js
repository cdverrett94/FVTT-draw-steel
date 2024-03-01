const mcdmConditions = [
    {
        img: 'icons/svg/skull.svg',
        id: 'dead',
        _id: 'dead000000000000',
        name: 'conditions.dead',
        label: 'conditions.dead',
    },
    {
        img: 'icons/svg/blood.svg',
        id: 'bloodied',
        _id: 'bloodied00000000',
        name: 'conditions.bloodied',
        label: 'conditions.bloodied',
    },
    {
        img: 'icons/svg/daze.svg',
        id: 'dazed',
        _id: 'dazed00000000000',
        name: 'conditions.dazed',
        label: 'conditions.dazed',
    },
    {
        img: 'icons/svg/terror.svg',
        id: 'frightened',
        _id: 'frightened000000',
        name: 'conditions.frightened',
        label: 'conditions.frightened',
    },

    {
        img: 'icons/svg/net.svg',
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
        img: 'icons/svg/fire.svg',
        id: 'ongoingdamage',
        _id: 'ongoingdamage000',
        name: 'conditions.ongoing-damage',
        label: 'conditions.ongoing-damage',
    },
    {
        img: 'icons/svg/falling.svg',
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
        img: 'icons/svg/trap.svg',
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
        img: 'icons/svg/wingfoot.svg',
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
        img: 'icons/svg/paralysis.svg',
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
        img: 'icons/svg/sword.svg',
        id: 'taunted',
        _id: 'taunted000000000',
        name: 'conditions.taunted',
        label: 'conditions.taunted',
    },
    {
        img: 'icons/svg/ruins.svg',
        id: 'unbalanced',
        _id: 'unbalanced000000',
        name: 'conditions.unbalanced',
        label: 'conditions.unbalanced',
    },
    {
        img: 'icons/svg/unconscious.svg',
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
        statuses: ['prone'],
    },
    {
        img: 'icons/svg/stoned.svg',
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
