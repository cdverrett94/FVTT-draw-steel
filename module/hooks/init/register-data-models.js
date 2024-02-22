import { MCDMActorProxy } from '../../documents/actors/actor-proxy.js';
import { HeroData } from '../../documents/actors/hero/data-model.js';
import { MonsterData } from '../../documents/actors/monster/data-model.js';
import { AbilityData } from '../../documents/items/ability/data-model.js';
import { AncestryData } from '../../documents/items/ancestry/data-model.js';
import { ClassData } from '../../documents/items/class/data-model.js';
import { ConditionData } from '../../documents/items/condition/data-model.js';
import { MCDMItemProxy } from '../../documents/items/item-proxy.js';
import { KitData } from '../../documents/items/kit/data-model.js';

export function registerDataModels() {
    // Set System Actor Data Models
    CONFIG.Actor.dataModels.hero = HeroData;
    CONFIG.Actor.dataModels.monster = MonsterData;

    // Set System Item Data Models
    CONFIG.Item.dataModels.ability = AbilityData;
    CONFIG.Item.dataModels.ancestry = AncestryData;
    CONFIG.Item.dataModels.class = ClassData;
    CONFIG.Item.dataModels.condition = ConditionData;
    CONFIG.Item.dataModels.kit = KitData;

    // Set System Document Classes
    CONFIG.Actor.documentClass = MCDMActorProxy;
    CONFIG.Item.documentClass = MCDMItemProxy;
}
