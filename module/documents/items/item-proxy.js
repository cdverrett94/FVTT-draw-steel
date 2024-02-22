import { MCDMRPGAbilityItem } from './ability/ability.js';
import { MCDMRPGAncestryItem } from './ancestry/ancestry.js';
import { MCDMRPGItem } from './base/base.js';
import { MCDMRPGClassItem } from './class/class.js';
import { MCDMRPGConditionItem } from './condition/condition.js';
import { MCDMRPGKitItem } from './kit/kit.js';

const itemTypes = {
    ability: MCDMRPGAbilityItem,
    kit: MCDMRPGKitItem,
    class: MCDMRPGClassItem,
    ancestry: MCDMRPGAncestryItem,
    condition: MCDMRPGConditionItem,
};

export const MCDMItemProxy = new Proxy(MCDMRPGItem, {
    construct(target, args) {
        const ItemClass = itemTypes[args[0]?.type] ?? MCDMRPGItem;
        return new ItemClass(...args);
    },
});
