import { MONSTER_ROLES, NEGOTIATION } from '../../constants/_index.js';
import { getDataModelChoices } from '../../helpers.js';
import { BaseActorData } from '../_index.js';

export class MonsterData extends BaseActorData {
    static LOCALIZATION_PREFIXES = ['system.actors.monsters', 'system.actors.base'];
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
            negotiation: new fields.SchemaField({
                interest: new fields.NumberField({
                    initial: 0,
                    min: 0,
                    max: 5,
                    integer: true,
                }),
                patience: new fields.NumberField({
                    initial: 0,
                    min: 0,
                    max: 5,
                    integer: true,
                }),
                motivations: new fields.SetField(
                    new fields.StringField({
                        choices: getDataModelChoices(NEGOTIATION.MOTIVATIONS),
                    })
                ),
                pitfalls: new fields.SetField(new fields.StringField()),
            }),
        };
    }
}
