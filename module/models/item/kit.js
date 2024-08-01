import { KITS } from '../../constants/kits.js';
import { getDataModelChoices } from '../../helpers.js';
import { BaseItemData } from './base-item.js';

export class KitData extends BaseItemData {
    static LOCALIZATION_PREFIXES = ['system.items.kit'];
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            type: new fields.StringField({
                choices: getDataModelChoices(KITS.TYPES),
            }),
            armor: new fields.ArrayField(
                new fields.StringField({
                    choices: getDataModelChoices(KITS.ARMOR),
                })
            ),
            weapon: new fields.ArrayField(
                new fields.StringField({
                    choices: getDataModelChoices(KITS.WEAPON),
                })
            ),
            implement: new fields.ArrayField(
                new fields.StringField({
                    choices: getDataModelChoices(KITS.IMPLEMENT),
                })
            ),

            stamina: new fields.NumberField({
                integer: true,
                min: 0,
                initial: 0,
            }),
            speed: new fields.NumberField({
                integer: true,
                min: 0,
                initial: 0,
            }),
            stability: new fields.NumberField({
                integer: true,
                min: 0,
                initial: 0,
            }),

            damage: new fields.SchemaField({
                melee: new fields.ArrayField(
                    new fields.NumberField({
                        integer: true,
                        min: 0,
                    }),
                    {
                        initial: [0, 0, 0],
                        min: 3,
                        max: 3,
                    }
                ),
                range: new fields.ArrayField(
                    new fields.NumberField({
                        integer: true,
                        min: 0,
                    }),
                    {
                        initial: [0, 0, 0],
                        min: 3,
                        max: 3,
                    }
                ),
                magic: new fields.ArrayField(
                    new fields.NumberField({
                        integer: true,
                        min: 0,
                    }),
                    {
                        initial: [0, 0, 0],
                        min: 3,
                        max: 3,
                    }
                ),
            }),

            area: new fields.NumberField({
                integer: true,
                min: 0,
                initial: 0,
            }),
            reach: new fields.NumberField({
                integer: true,
                min: 0,
                initial: 0,
            }),
            distance: new fields.NumberField({
                integer: true,
                min: 0,
                initial: 0,
            }),
        };
    }
}
