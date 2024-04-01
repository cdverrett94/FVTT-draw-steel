import { toId } from '../helpers.js';

const CONDITIONS = {
    dead: {
        img: 'icons/svg/skull.svg',
        id: 'dead',
        _id: toId('dead'),
        name: 'system.conditions.dead',
        label: 'system.conditions.dead',
        statuses: ['dead'],
    },
    bloodied: {
        img: 'icons/svg/blood.svg',
        id: 'bloodied',
        _id: toId('bloodied'),
        name: 'system.conditions.bloodied',
        label: 'system.conditions.bloodied',
        statuses: ['bloodied'],
    },
    dazed: {
        img: 'icons/svg/daze.svg',
        id: 'dazed',
        _id: toId('dazed'),
        name: 'system.conditions.dazed',
        label: 'system.conditions.dazed',
        statuses: ['dazed'],
    },
    frightened: {
        img: 'icons/svg/terror.svg',
        id: 'frightened',
        _id: toId('frightened'),
        name: 'system.conditions.frightened',
        label: 'system.conditions.frightened',
        statuses: ['frightened'],
        changes: [
            {
                key: 'system.frightened',
                value: '',
                mode: 2,
            },
        ],
        flags: {
            mcdmrpg: {
                titles: ['New Frightened'],
            },
        },
    },
    grappled: {
        img: 'icons/svg/net.svg',
        id: 'grappled',
        _id: toId('grappled'),
        name: 'system.conditions.grappled',
        label: 'system.conditions.grappled',
        statuses: ['grappled'],
        changes: [
            {
                key: 'system.speed',
                value: '0',
                mode: 5,
            },
        ],
    },
    ongoingdamage: {
        img: 'icons/svg/fire.svg',
        id: 'ongoingdamage',
        _id: toId('ongoingdamage'),
        name: 'system.conditions.ongoing-damage',
        label: 'system.conditions.ongoing-damage',
        statuses: ['ongoingdamage'],
        changes: [
            {
                key: 'system.ongoingDamage.untyped',
                value: '0',
                mode: 2,
            },
        ],
        flags: {
            mcdmrpg: {
                titles: ['New Ongoing Damage'],
            },
        },
    },
    prone: {
        img: 'icons/svg/falling.svg',
        id: 'prone',
        _id: toId('prone'),
        name: 'system.conditions.prone',
        label: 'system.conditions.prone',
        statuses: ['prone'],
        changes: [
            {
                key: 'system.banes.attacker',
                value: '1',
                mode: 2,
            },
            {
                key: 'system.edges.attacked',
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
    restrained: {
        img: 'icons/svg/trap.svg',
        id: 'restrained',
        _id: toId('restrained'),
        name: 'system.conditions.restrained',
        label: 'system.conditions.restrained',
        statuses: ['restrained'],
        changes: [
            {
                key: 'system.banes.attacker',
                value: '1',
                mode: 2,
                priority: null,
            },
            {
                key: 'system.edges.attacked',
                value: '1',
                mode: 2,
                priority: null,
            },
        ],
    },
    slowed: {
        img: 'icons/svg/wingfoot.svg',
        id: 'slowed',
        _id: toId('slowed'),
        name: 'system.conditions.slowed',
        label: 'system.conditions.slowed',
        statuses: ['slowed'],
        changes: [
            {
                key: 'system.speed',
                value: '.5',
                mode: 1,
                priority: null,
            },
        ],
    },
    surprised: {
        img: 'icons/svg/paralysis.svg',
        id: 'surprised',
        _id: toId('surprised'),
        name: 'system.conditions.surprised',
        label: 'system.conditions.surprised',
        statuses: ['surprised'],
        changes: [
            {
                key: 'system.edges.attacked',
                value: '1',
                mode: 2,
                priority: null,
            },
        ],
    },
    taunted: {
        img: 'icons/svg/sword.svg',
        id: 'taunted',
        _id: toId('taunted'),
        name: 'system.conditions.taunted',
        label: 'system.conditions.taunted',
        statuses: ['taunted'],
        changes: [
            {
                key: 'system.taunted',
                value: '',
                mode: 2,
            },
        ],
        flags: {
            mcdmrpg: {
                titles: ['New Taunted'],
            },
        },
    },
    unbalanced: {
        img: 'icons/svg/ruins.svg',
        id: 'unbalanced',
        _id: toId('unbalanced'),
        name: 'system.conditions.unbalanced',
        label: 'system.conditions.unbalanced',
        statuses: ['unbalanced'],
    },
    unconscious: {
        img: 'icons/svg/unconscious.svg',
        id: 'unconscious',
        _id: toId('unconscious'),
        name: 'system.conditions.unconscious',
        label: 'system.conditions.unconscious',
        statuses: ['unconscious', 'prone'],
        changes: [
            {
                key: 'system.speed',
                value: '0',
                mode: 5,
                priority: null,
            },
            {
                key: 'system.edges.attacked',
                value: '2',
                mode: 2,
                priority: null,
            },
        ],
    },
    weakend: {
        img: 'icons/svg/stoned.svg',
        id: 'weakened',
        _id: toId('weakened'),
        name: 'system.conditions.weakened',
        label: 'system.conditions.weakened',
        statuses: ['weakened'],
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
};

export { CONDITIONS };
