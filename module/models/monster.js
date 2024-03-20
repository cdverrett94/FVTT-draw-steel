import { MONSTER_ROLES } from '../constants/_index.js';
import { getDataModelChoices } from '../helpers.js';
import { BaseActorData } from './base-actor.js';

export class MonsterData extends BaseActorData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            role: new fields.StringField({
                choices: getDataModelChoices(MONSTER_ROLES),
            }),
            bonusDamage: new fields.NumberField({
                initial: 0,
                label: 'system.sheets.actor.bonusDamage',
            }),
            bonusTN: new fields.NumberField({
                initial: 0,
                label: 'system.sheets.actor.bonusTN',
            }),
            size: new fields.SchemaField({
                width: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.width',
                }),
                length: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.length',
                }),
                height: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.height',
                }),
                weight: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                    label: 'system.sheets.actor.size.weight',
                }),
            }),
        };
    }
}
