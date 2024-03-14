import { toId } from '../helpers.js';

const CONDITIONS = {
    dead: {
        img: 'icons/svg/skull.svg',
        id: 'dead',
        _id: toId('dead'),
        name: 'system.conditions.dead',
        label: 'system.conditions.dead',
    },
    bloodied: {
        img: 'icons/svg/blood.svg',
        id: 'bloodied',
        _id: toId('bloodied'),
        name: 'system.conditions.bloodied',
        label: 'system.conditions.bloodied',
    },
    dazed: {
        img: 'icons/svg/daze.svg',
        id: 'dazed',
        _id: toId('dazed'),
        name: 'system.conditions.dazed',
        label: 'system.conditions.dazed',
    },
    frightened: {
        img: 'icons/svg/terror.svg',
        id: 'frightened',
        _id: toId('frightened'),
        name: 'system.conditions.frightened',
        label: 'system.conditions.frightened',
    },
    grappled: {
        img: 'icons/svg/net.svg',
        id: 'grappled',
        _id: toId('grappled00000000'),
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
    ongoingdamage: {
        img: 'icons/svg/fire.svg',
        id: 'ongoingdamage',
        _id: toId('ongoingdamage'),
        name: 'system.conditions.ongoing-damage',
        label: 'system.conditions.ongoing-damage',
    },
    prone: {
        img: 'icons/svg/falling.svg',
        id: 'prone',
        _id: toId('prone'),
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
    restrained: {
        img: 'icons/svg/trap.svg',
        id: 'restrained',
        _id: toId('restrained'),
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
    slowed: {
        img: 'icons/svg/wingfoot.svg',
        id: 'slowed',
        _id: toId('slowed'),
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
    surprised: {
        img: 'icons/svg/paralysis.svg',
        id: 'surprised',
        _id: toId('surprised'),
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
    taunted: {
        img: 'icons/svg/sword.svg',
        id: 'taunted',
        _id: toId('taunted'),
        name: 'system.conditions.taunted',
        label: 'system.conditions.taunted',
    },
    unbalanced: {
        img: 'icons/svg/ruins.svg',
        id: 'unbalanced',
        _id: toId('unbalanced'),
        name: 'system.conditions.unbalanced',
        label: 'system.conditions.unbalanced',
    },
    unconscious: {
        img: 'icons/svg/unconscious.svg',
        id: 'unconscious',
        _id: toId('unconscious'),
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
    weakend: {
        img: 'icons/svg/stoned.svg',
        id: 'weakened',
        _id: toId('weakened'),
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
};

export { CONDITIONS };
