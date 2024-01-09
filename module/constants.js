const characteristics = ['might', 'agility', 'endurance', 'reason', 'intuition', 'presence'];
const characteristicSelectOptions = {
    might: 'characteristics.might.label',
    agility: 'characteristics.agility.label',
    endurance: 'characteristics.endurance.label',
    reason: 'characteristics.reason.label',
    intuition: 'characteristics.intuition.label',
    presence: 'characteristics.presence.label',
};
const skills = ['acrobatics', 'athletics', 'charm', 'craft', 'deceive', 'empathy', 'intimidate', 'knowledge', 'notice', 'skulduggery', 'stealth', 'vigor'];
const keywords = ['attack', 'kit', 'magic', 'psionic', 'weapon'];
const damageTypes = ['untyped', 'acid', 'cold', 'corruption', 'fire', 'holy', 'lightning', 'poison', 'psychic', 'sonic'];
const damageTypeSelectOptions = {
    untyped: 'damageTypes.untyped.label',
    acid: 'damageTypes.acid.label',
    cold: 'damageTypes.cold.label',
    corruption: 'damageTypes.corruption.label',
    fire: 'damageTypes.fire.label',
    holy: 'damageTypes.holy.label',
    lightning: 'damageTypes.lightning.label',
    poison: 'damageTypes.poison.label',
    psychic: 'damageTypes.psychic.label',
    sonic: 'damageTypes.sonic.label',
};
const baseAbilityTypes = ['action', 'basic', 'manuever', 'triggered'];
const heroAbilityTypes = ['signature', 'heroic'];
const monsterAbilityTypes = ['passive', 'villain'];
const monsterRoles = ['ambusher', 'artillery', 'brute', 'bystander', 'controller', 'leader', 'minion', 'skirmisher', 'soldier', 'solo', 'support'];

const abilityTypes = [...baseAbilityTypes, ...heroAbilityTypes, ...monsterAbilityTypes].sort();

const actionTimes = ['action', 'manuever', 'free-manuever', 'triggered', 'free-triggered'];
const actionTimeSelectOptions = {
    'action': 'actionTimes.action.label',
    'manuever': 'actionTimes.manuever.label',
    'free-manuever': 'actionTimes.free-manuever.label',
    'triggered': 'actionTimes.triggered.label',
    'free-triggered': 'actionTimes.free-triggered.label',
};

export {
    abilityTypes,
    actionTimeSelectOptions,
    actionTimes,
    characteristicSelectOptions,
    characteristics,
    damageTypeSelectOptions,
    damageTypes,
    keywords,
    monsterRoles,
    skills,
};
