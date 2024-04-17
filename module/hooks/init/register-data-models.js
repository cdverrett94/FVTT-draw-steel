import { AbilityData, AbilityMessagesData, AncestryData, ClassData, CombatData, CombatantData, HeroData, KitData, MonsterData } from '../../models/_index.js';

export function registerDataModels() {
    // Set System Actor Data Models
    CONFIG.Actor.dataModels.hero = HeroData;
    CONFIG.Actor.dataModels.monster = MonsterData;

    // Set System Item Data Models
    CONFIG.Item.dataModels.ability = AbilityData;
    CONFIG.Item.dataModels.ancestry = AncestryData;
    CONFIG.Item.dataModels.class = ClassData;
    CONFIG.Item.dataModels.kit = KitData;

    // Set System Combat Data Models
    CONFIG.Combat.dataModels.mcdmrpg = CombatData;
    CONFIG.Combatant.dataModels.mcdmrpg = CombatantData;

    // Set Chat Message Data Models
    CONFIG.ChatMessage.dataModels.ability = AbilityMessagesData;
}
