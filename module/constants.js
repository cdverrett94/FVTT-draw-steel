const characteristics = {
    might: {
        label: 'mcdmrpg.characteristics.might.label',
        abbreviation: 'mcdmrpg.characteristics.might.abbreviation',
    },
    agility: {
        label: 'mcdmrpg.characteristics.agility.label',
        abbreviation: 'mcdmrpg.characteristics.agility.abbreviation',
    },
    endurance: {
        label: 'mcdmrpg.characteristics.endurance.label',
        abbreviation: 'mcdmrpg.characteristics.endurance.abbreviation',
    },
    reason: {
        label: 'mcdmrpg.characteristics.reason.label',
        abbreviation: 'mcdmrpg.characteristics.reason.abbreviation',
    },
    intuition: {
        label: 'mcdmrpg.characteristics.intuition.label',
        abbreviation: 'mcdmrpg.characteristics.intuition.abbreviation',
    },
    presence: {
        label: 'mcdmrpg.characteristics.presence.label',
        abbreviation: 'mcdmrpg.characteristics.presence.abbreviation',
    },
};
const skills = {
    acrobatics: { label: 'mcdmrpg.skills.acrobatics.label', default: 'agility' },
    athletics: { label: 'mcdmrpg.skills.athletics.label', default: 'might' },
    charm: { label: 'mcdmrpg.skills.charm.label', default: 'presence' },
    craft: { label: 'mcdmrpg.skills.craft.label', default: 'reason' },
    deceive: { label: 'mcdmrpg.skills.deceive.label', default: 'presence' },
    empathy: { label: 'mcdmrpg.skills.empathy.label', default: 'intuition' },
    intimidate: { label: 'mcdmrpg.skills.intimidate.label', default: 'presence' },
    knowledge: { label: 'mcdmrpg.skills.knowledge.label', default: 'reason' },
    notice: { label: 'mcdmrpg.skills.notice.label', default: 'intuition' },
    skulduggery: { label: 'mcdmrpg.skills.skullduggery.label', default: 'agility' },
    stealth: { label: 'mcdmrpg.skills.stealth.label', default: 'agility' },
    vigor: { label: 'mcdmrpg.skills.vigor.label', default: 'might' },
};
const keywords = {
    attack: { label: 'mcdmrpg.keywords.attack.label' },
    kit: { label: 'mcdmrpg.keywords.kit.label' },
    magic: { label: 'mcdmrpg.keywords.magic.label' },
    psionic: { label: 'mcdmrpg.keywords.psionic.label' },
    weapon: { label: 'mcdmrpg.keywords.weapon.label' },
};
const damageTypes = {
    untyped: { label: 'mcdmrpg.damageTypes.untyped.label' },
    acid: { label: 'mcdmrpg.damageTypes.acid.label' },
    cold: { label: 'mcdmrpg.damageTypes.cold.label' },
    corruption: { label: 'mcdmrpg.damageTypes.corruption.label' },
    fire: { label: 'mcdmrpg.damageTypes.fire.label' },
    holy: { label: 'mcdmrpg.damageTypes.holy.label' },
    lightning: { label: 'mcdmrpg.damageTypes.lightning.label' },
    poison: { label: 'mcdmrpg.damageTypes.poison.label' },
    psychic: { label: 'mcdmrpg.damageTypes.psychic.label' },
    sonic: { label: 'mcdmrpg.damageTypes.sonic.label' },
};
const baseAbilityTypes = ['action', 'basic', 'manuever', 'triggered'];
const heroAbilityTypes = ['signature', 'heroic'];
const monsterAbilityTypes = ['passive', 'villain'];
const monsterRoles = ['ambusher', 'artillery', 'brute', 'bystander', 'controller', 'leader', 'minion', 'skirmisher', 'soldier', 'solo', 'support'];

const abilityTypes = [...baseAbilityTypes, ...heroAbilityTypes, ...monsterAbilityTypes].sort();

const abilityTimes = {
    'action': { label: 'mcdmrpg.abilities.times.action.label' },
    'maneuver': { label: 'mcdmrpg.abilities.times.maneuver.label' },
    'free-maneuver': { label: 'mcdmrpg.abilities.times.free-maneuver.label' },
    'triggered': { label: 'mcdmrpg.abilities.times.triggered.label' },
    'free-triggered': { label: 'mcdmrpg.abilities.times.free-triggered.label' },
};

const tnDifficulty = {
    easy: 7,
    moderate: 9,
    hard: 12,
};

export { abilityTimes, abilityTypes, actionTimes, characteristics, damageTypes, keywords, monsterRoles, skills, tnDifficulty };
