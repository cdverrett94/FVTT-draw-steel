const mcdmConditions = [
    {
        img: 'icons/svg/skull.svg',
        id: 'dead',
        _id: 'dead000000000000',
        name: 'mcdmrpg.conditions.dead',
        label: 'mcdmrpg.conditions.dead',
    },
    {
        img: 'icons/svg/blood.svg',
        id: 'bloodied',
        _id: 'bloodied00000000',
        name: 'mcdmrpg.conditions.bloodied',
        label: 'mcdmrpg.conditions.bloodied',
    },
    {
        img: 'icons/svg/daze.svg',
        id: 'dazed',
        _id: 'dazed00000000000',
        name: 'mcdmrpg.conditions.dazed',
        label: 'mcdmrpg.conditions.dazed',
    },
    {
        img: 'icons/svg/terror.svg',
        id: 'frightened',
        _id: 'frightened000000',
        name: 'mcdmrpg.conditions.frightened',
        label: 'mcdmrpg.conditions.frightened',
    },

    {
        img: 'icons/svg/net.svg',
        id: 'grappled',
        _id: 'grappled00000000',
        name: 'mcdmrpg.conditions.grappled',
        label: 'mcdmrpg.conditions.grappled',
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
        name: 'mcdmrpg.conditions.ongoing-damage',
        label: 'mcdmrpg.conditions.ongoing-damage',
    },
    {
        img: 'icons/svg/falling.svg',
        id: 'prone',
        _id: 'prone00000000000',
        name: 'mcdmrpg.conditions.prone',
        label: 'mcdmrpg.conditions.prone',
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
        name: 'mcdmrpg.conditions.restrained',
        label: 'mcdmrpg.conditions.restrained',
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
        name: 'mcdmrpg.conditions.slowed',
        label: 'mcdmrpg.conditions.slowed',
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
        name: 'mcdmrpg.conditions.surprised',
        label: 'mcdmrpg.conditions.surprised',
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
        name: 'mcdmrpg.conditions.taunted',
        label: 'mcdmrpg.conditions.taunted',
    },
    {
        img: 'icons/svg/ruins.svg',
        id: 'unbalanced',
        _id: 'unbalanced000000',
        name: 'mcdmrpg.conditions.unbalanced',
        label: 'mcdmrpg.conditions.unbalanced',
    },
    {
        img: 'icons/svg/unconscious.svg',
        id: 'unconscious',
        _id: 'unconscious00000',
        name: 'mcdmrpg.conditions.unconscious',
        label: 'mcdmrpg.conditions.unconscious',
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
        name: 'mcdmrpg.conditions.weakened',
        label: 'mcdmrpg.conditions.weakened',
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
