const abilityTimes = {
    'action': { label: 'system.abilities.times.action.label' },
    'maneuver': { label: 'system.abilities.times.maneuver.label' },
    'free-maneuver': { label: 'system.abilities.times.free-maneuver.label' },
    'triggered': { label: 'system.abilities.times.triggered.label' },
    'free-triggered': { label: 'system.abilities.times.free-triggered.label' },
};
const abilityTypes = {
    passive: { label: 'system.abilities.types.passive.label', appliesTo: ['monster'] },
    action: { label: 'system.abilities.types.action.label', appliesTo: ['monster', 'hero'] },
    basic: { label: 'system.abilities.types.basic.label', appliesTo: ['monster', 'hero'] },
    maneuver: { label: 'system.abilities.types.maneuver.label', appliesTo: ['monster', 'hero'] },
    triggered: { label: 'system.abilities.types.triggered.label', appliesTo: ['monster', 'hero'] },
    signature: { label: 'system.abilities.types.signature.label', appliesTo: ['hero'] },
    heroic: { label: 'system.abilities.types.heroic.label', appliesTo: ['hero'] },
    villain: { label: 'system.abilities.types.villain.label', appliesTo: ['monster'] },
};

const characteristics = {
    might: {
        label: 'system.characteristics.might.label',
        abbreviation: 'system.characteristics.might.abbreviation',
    },
    agility: {
        label: 'system.characteristics.agility.label',
        abbreviation: 'system.characteristics.agility.abbreviation',
    },
    endurance: {
        label: 'system.characteristics.endurance.label',
        abbreviation: 'system.characteristics.endurance.abbreviation',
    },
    reason: {
        label: 'system.characteristics.reason.label',
        abbreviation: 'system.characteristics.reason.abbreviation',
    },
    intuition: {
        label: 'system.characteristics.intuition.label',
        abbreviation: 'system.characteristics.intuition.abbreviation',
    },
    presence: {
        label: 'system.characteristics.presence.label',
        abbreviation: 'system.characteristics.presence.abbreviation',
    },
};
const damageTypes = {
    untyped: { label: 'system.damageTypes.untyped.label' },
    acid: { label: 'system.damageTypes.acid.label' },
    cold: { label: 'system.damageTypes.cold.label' },
    corruption: { label: 'system.damageTypes.corruption.label' },
    fire: { label: 'system.damageTypes.fire.label' },
    holy: { label: 'system.damageTypes.holy.label' },
    lightning: { label: 'system.damageTypes.lightning.label' },
    poison: { label: 'system.damageTypes.poison.label' },
    psychic: { label: 'system.damageTypes.psychic.label' },
    sonic: { label: 'system.damageTypes.sonic.label' },
};
const keywords = {
    attack: { label: 'system.keywords.attack.label' },
    kit: { label: 'system.keywords.kit.label' },
    magic: { label: 'system.keywords.magic.label' },
    psionic: { label: 'system.keywords.psionic.label' },
    weapon: { label: 'system.keywords.weapon.label' },
};
const monsterRoles = ['ambusher', 'artillery', 'brute', 'bystander', 'controller', 'leader', 'minion', 'skirmisher', 'soldier', 'solo', 'support'];
const skills = {
    acrobatics: { label: 'system.skills.acrobatics.label', default: 'agility' },
    athletics: { label: 'system.skills.athletics.label', default: 'might' },
    charm: { label: 'system.skills.charm.label', default: 'presence' },
    craft: { label: 'system.skills.craft.label', default: 'reason' },
    deceive: { label: 'system.skills.deceive.label', default: 'presence' },
    empathy: { label: 'system.skills.empathy.label', default: 'intuition' },
    intimidate: { label: 'system.skills.intimidate.label', default: 'presence' },
    knowledge: { label: 'system.skills.knowledge.label', default: 'reason' },
    notice: { label: 'system.skills.notice.label', default: 'intuition' },
    skulduggery: { label: 'system.skills.skullduggery.label', default: 'agility' },
    stealth: { label: 'system.skills.stealth.label', default: 'agility' },
    vigor: { label: 'system.skills.vigor.label', default: 'might' },
};
const tnDifficulty = {
    easy: 7,
    moderate: 9,
    hard: 12,
};

export { abilityTimes, abilityTypes, characteristics, damageTypes, keywords, monsterRoles, skills, tnDifficulty };
