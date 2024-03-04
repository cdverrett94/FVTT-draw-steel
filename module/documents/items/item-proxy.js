import { MCDMRPGAbilityItem } from './ability/ability-document.js';
import { MCDMRPGAncestryItem } from './ancestry/ancestry-document.js';
import { MCDMRPGItem } from './base/base-document.js';
import { MCDMRPGClassItem } from './class/class-document.js';
import { MCDMRPGKitItem } from './kit/kit-document.js';

const itemTypes = {
    ability: MCDMRPGAbilityItem,
    kit: MCDMRPGKitItem,
    class: MCDMRPGClassItem,
    ancestry: MCDMRPGAncestryItem,
};

export const MCDMItemProxy = new Proxy(MCDMRPGItem, {
    construct(target, args) {
        const ItemClass = itemTypes[args[0]?.type] ?? MCDMRPGItem;
        return new ItemClass(...args);
    },
});
