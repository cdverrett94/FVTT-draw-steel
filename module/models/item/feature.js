import { BaseItemData } from './base-item.js';

export class FeatureData extends BaseItemData {
    static LOCALIZATION_PREFIXES = ['system.items.feature'];

    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
        };
    }
}
