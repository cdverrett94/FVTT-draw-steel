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
    dazed: {
        img: 'icons/svg/daze.svg',
        id: 'dazed',
        _id: toId('dazed'),
        name: 'system.conditions.dazed.label',
        label: 'system.conditions.dazed.label',
        description: 'system.conditions.dazed.description',
        statuses: ['dazed'],
    },
    frightened: {
        img: 'icons/svg/terror.svg',
        id: 'frightened',
        _id: toId('frightened'),
        name: 'system.conditions.frightened.label',
        label: 'system.conditions.frightened.label',
        description: 'system.conditions.frightened.description',
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
        name: 'system.conditions.grappled.label',
        label: 'system.conditions.grappled.label',
        description: 'system.conditions.grappled.description',
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
        name: 'system.conditions.ongoing-damage.label',
        label: 'system.conditions.ongoing-damage.label',
        description: 'system.conditions.ongoing-damage.description',
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
        name: 'system.conditions.prone.label',
        label: 'system.conditions.prone.label',
        description: 'system.conditions.prone.description',
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
        name: 'system.conditions.restrained.label',
        label: 'system.conditions.restrained.label',
        description: 'system.conditions.restrained.description',
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
        name: 'system.conditions.slowed.label',
        label: 'system.conditions.slowed.label',
        description: 'system.conditions.slowed.description',
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
        name: 'system.conditions.surprised.label',
        label: 'system.conditions.surprised.label',
        description: 'system.conditions.surprised.description',
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
        name: 'system.conditions.taunted.label',
        label: 'system.conditions.taunted.label',
        description: 'system.conditions.taunted.description',
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
        name: 'system.conditions.unbalanced.label',
        label: 'system.conditions.unbalanced.label',
        description: 'system.conditions.unbalanced.description',
        statuses: ['unbalanced'],
    },
    unconscious: {
        img: 'icons/svg/unconscious.svg',
        id: 'unconscious',
        _id: toId('unconscious'),
        name: 'system.conditions.unconscious.label',
        label: 'system.conditions.unconscious.label',
        description: 'system.conditions.unconscious.description',
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
    weakened: {
        img: 'icons/svg/stoned.svg',
        id: 'weakened',
        _id: toId('weakened'),
        name: 'system.conditions.weakened.label',
        label: 'system.conditions.weakened.label',
        description: 'system.conditions.weakened.description',
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
    winded: {
        img: 'icons/svg/blood.svg',
        id: 'winded',
        _id: toId('winded'),
        name: 'system.conditions.winded.label',
        label: 'system.conditions.winded.label',
        description: 'system.conditions.winded.description',
        statuses: ['winded'],
    },
};

export { CONDITIONS };
