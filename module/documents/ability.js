import { BaseItem } from './base-item.js';

export class AbilityItem extends BaseItem {
    rollOptions(prefix = 'ability') {
        const rollOptions = super.rollOptions(prefix);

        // add keywords
        this.system.keywords.forEach((keyword) => rollOptions.push(`${prefix}:keyword:${keyword}`));

        // add type
        rollOptions.push(`${prefix}:type:${this.system.type}`);

        return rollOptions;
    }
}
