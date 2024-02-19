const characteristics = {
    might: {
        label: 'characteristics.might.label',
        abbreviation: 'characteristics.might.abbreviation',
    },
    agility: {
        label: 'characteristics.agility.label',
        abbreviation: 'characteristics.agility.abbreviation',
    },
    endurance: {
        label: 'characteristics.endurance.label',
        abbreviation: 'characteristics.endurance.abbreviation',
    },
    reason: {
        label: 'characteristics.reason.label',
        abbreviation: 'characteristics.reason.abbreviation',
    },
    intuition: {
        label: 'characteristics.intuition.label',
        abbreviation: 'characteristics.intuition.abbreviation',
    },
    presence: {
        label: 'characteristics.presence.label',
        abbreviation: 'characteristics.presence.abbreviation',
    },
};
const skills = {
    acrobatics: { label: 'skills.acrobatics.label' },
    athletics: { label: 'skills.athletics.label' },
    charm: { label: 'skills.charm.label' },
    craft: { label: 'skills.craft.label' },
    deceive: { label: 'skills.deceive.label' },
    empathy: { label: 'skills.empathy.label' },
    intimidate: { label: 'skills.intimidate.label' },
    knowledge: { label: 'skills.knowledge.label' },
    notice: { label: 'skills.notice.label' },
    skulduggery: { label: 'skills.skullduggery.label' },
    stealth: { label: 'skills.stealth.label' },
    vigor: { label: 'skills.vigor.label' },
};
const keywords = ['attack', 'kit', 'magic', 'psionic', 'weapon'];
const damageTypes = {
    untyped: { label: 'damageTypes.untyped.label' },
    acid: { label: 'damageTypes.acid.label' },
    cold: { label: 'damageTypes.cold.label' },
    corruption: { label: 'damageTypes.corruption.label' },
    fire: { label: 'damageTypes.fire.label' },
    holy: { label: 'damageTypes.holy.label' },
    lightning: { label: 'damageTypes.lightning.label' },
    poison: { label: 'damageTypes.poison.label' },
    psychic: { label: 'damageTypes.psychic.label' },
    sonic: { label: 'damageTypes.sonic.label' },
};
const baseAbilityTypes = ['action', 'basic', 'manuever', 'triggered'];
const heroAbilityTypes = ['signature', 'heroic'];
const monsterAbilityTypes = ['passive', 'villain'];
const monsterRoles = ['ambusher', 'artillery', 'brute', 'bystander', 'controller', 'leader', 'minion', 'skirmisher', 'soldier', 'solo', 'support'];

const abilityTypes = [...baseAbilityTypes, ...heroAbilityTypes, ...monsterAbilityTypes].sort();

const actionTimes = ['action', 'manuever', 'free-manuever', 'triggered', 'free-triggered'];

const abilityTimes = {
    'action': { label: 'abilityTimes.action.label' },
    'maneuver': { label: 'abilityTimes.maneuver.label' },
    'free-maneuver': { label: 'abilityTimes.free-maneuver.label' },
    'triggered': { label: 'abilityTimes.triggered.label' },
    'free-triggered': { label: 'abilityTimes.free-triggered.label' },
};

export { abilityTimes, abilityTypes, actionTimes, characteristics, damageTypes, keywords, monsterRoles, skills };
