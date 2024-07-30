import { CULTURE } from '../../constants/culture.js';
import { getDataModelChoices } from '../../helpers.js';
import { BaseItemData } from './base-item.js';

export class CultureData extends BaseItemData {
    static LOCALIZATION_PREFIXES = ['system.items.culture'];

    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            category: new fields.StringField({
                choices: getDataModelChoices(CULTURE.SUBTYPES),
                initial: 'environment',
            }),
            skills: new fields.ObjectField(),
        };
    }
}
