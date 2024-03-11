import { AbilityData, AncestryData, ClassData, HeroData, KitData, MonsterData } from '../../models/_index.js';

export function registerDataModels() {
    // Set System Actor Data Models
    CONFIG.Actor.dataModels.hero = HeroData;
    CONFIG.Actor.dataModels.monster = MonsterData;

    // Set System Item Data Models
    CONFIG.Item.dataModels.ability = AbilityData;
    CONFIG.Item.dataModels.ancestry = AncestryData;
    CONFIG.Item.dataModels.class = ClassData;
    CONFIG.Item.dataModels.kit = KitData;
}
