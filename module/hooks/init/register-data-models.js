import {
    AbilityData,
    AbilityMessageData,
    AncestryData,
    CareerData,
    ClassData,
    CombatData,
    CombatantData,
    CultureData,
    FeatureData,
    HeroData,
    KitData,
    MonsterData,
} from '../../models/_index.js';

export function registerDataModels() {
    // Set System Actor Data Models
    CONFIG.Actor.dataModels.hero = HeroData;
    CONFIG.Actor.dataModels.monster = MonsterData;

    // Set System Item Data Models
    CONFIG.Item.dataModels.ability = AbilityData;
    CONFIG.Item.dataModels.ancestry = AncestryData;
    CONFIG.Item.dataModels.class = ClassData;
    CONFIG.Item.dataModels.kit = KitData;
    CONFIG.Item.dataModels.feature = FeatureData;
    CONFIG.Item.dataModels.culture = CultureData;
    CONFIG.Item.dataModels.career = CareerData;

    // Set System Combat Data Models
    CONFIG.Combat.dataModels['draw-steel'] = CombatData;
    CONFIG.Combatant.dataModels['draw-steel'] = CombatantData;

    // Set Chat Message Data Models
    CONFIG.ChatMessage.dataModels.ability = AbilityMessageData;
}
