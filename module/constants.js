const characteristics = ['might', 'agility', 'endurance', 'reason', 'intuition', 'presence'];
const skills = ['acrobatics', 'athletics', 'charm', 'craft', 'deceive', 'empathy', 'intimidate', 'knowledge', 'notice', 'skulduggery', 'stealth', 'vigor'];
const keywords = ['attack', 'kit', 'magic', 'psionic', 'weapon'];
const damageTypes = ['untyped', 'acid', 'cold', 'corruption', 'fire', 'holy', 'lightning', 'poison', 'psychic', 'sonic'];
const baseAbilityTypes = ['action', 'basic', 'manuever', 'triggered'];
const heroAbilityTypes = ['signature', 'heroic'];
const monsterAbilityTypes = ['villain'];

const abilityTypes = [...baseAbilityTypes, ...heroAbilityTypes, ...monsterAbilityTypes].sort();

export { abilityTypes, characteristics, damageTypes, keywords, skills };
