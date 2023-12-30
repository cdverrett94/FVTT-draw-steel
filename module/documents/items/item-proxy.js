import { MCDMRPGAbilityItem } from './ability/ability.js';
import { MCDMRPGItem } from './base/base.js';

const itemTypes = {
    ability: MCDMRPGAbilityItem,
};

export const MCDMItemProxy = new Proxy(MCDMRPGItem, {
    construct(target, args) {
        const ItemClass = itemTypes[args[0]?.type] ?? MCDMRPGItem;
        return new ItemClass(...args);
    },
});
