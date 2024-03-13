import { monsterRoles } from '../constants.js';
import { BaseActorData } from './base-actor.js';

export class MonsterData extends BaseActorData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            role: new fields.StringField({
                choices: monsterRoles,
            }),
            bonusDamage: new fields.NumberField({
                initial: 0,
            }),
            bonusTN: new fields.NumberField({
                initial: 0,
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
