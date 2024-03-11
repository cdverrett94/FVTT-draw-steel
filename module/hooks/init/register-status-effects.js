const mcdmConditions = [
    {
        img: 'icons/svg/skull.svg',
        id: 'dead',
        _id: 'dead000000000000',
        name: 'system.conditions.dead',
        label: 'system.conditions.dead',
    },
    {
        img: 'icons/svg/blood.svg',
        id: 'bloodied',
        _id: 'bloodied00000000',
        name: 'system.conditions.bloodied',
        label: 'system.conditions.bloodied',
    },
    {
        img: 'icons/svg/daze.svg',
        id: 'dazed',
        _id: 'dazed00000000000',
        name: 'system.conditions.dazed',
        label: 'system.conditions.dazed',
    },
    {
        img: 'icons/svg/terror.svg',
        id: 'frightened',
        _id: 'frightened000000',
        name: 'system.conditions.frightened',
        label: 'system.conditions.frightened',
    },

    {
        img: 'icons/svg/net.svg',
        id: 'grappled',
        _id: 'grappled00000000',
        name: 'system.conditions.grappled',
        label: 'system.conditions.grappled',
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
        name: 'system.conditions.ongoing-damage',
        label: 'system.conditions.ongoing-damage',
    },
    {
        img: 'icons/svg/falling.svg',
        id: 'prone',
        _id: 'prone00000000000',
        name: 'system.conditions.prone',
        label: 'system.conditions.prone',
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
        name: 'system.conditions.restrained',
        label: 'system.conditions.restrained',
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
        name: 'system.conditions.slowed',
        label: 'system.conditions.slowed',
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
        name: 'system.conditions.surprised',
        label: 'system.conditions.surprised',
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
        name: 'system.conditions.taunted',
        label: 'system.conditions.taunted',
    },
    {
        img: 'icons/svg/ruins.svg',
        id: 'unbalanced',
        _id: 'unbalanced000000',
        name: 'system.conditions.unbalanced',
        label: 'system.conditions.unbalanced',
    },
    {
        img: 'icons/svg/unconscious.svg',
        id: 'unconscious',
        _id: 'unconscious00000',
        name: 'system.conditions.unconscious',
        label: 'system.conditions.unconscious',
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
        name: 'system.conditions.weakened',
        label: 'system.conditions.weakened',
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
