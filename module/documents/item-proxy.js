import { AbilityItem, AncestryItem, BaseItem, ClassItem, KitItem } from './_index.js';

const itemTypes = {
    ability: AbilityItem,
    kit: KitItem,
    class: ClassItem,
    ancestry: AncestryItem,
};

export const ItemProxy = new Proxy(BaseItem, {
    construct(target, args) {
        const ItemClass = itemTypes[args[0]?.type] ?? BaseItem;
        return new ItemClass(...args);
    },
});
