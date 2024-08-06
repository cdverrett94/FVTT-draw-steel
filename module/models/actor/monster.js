import { MONSTER_ROLES, NEGOTIATION } from '../../constants/_index.js';
import { getDataModelChoices } from '../../helpers.js';
import { BaseActorData } from '../_index.js';

export class MonsterData extends BaseActorData {
    static LOCALIZATION_PREFIXES = ['system.actors.monster', 'system.actors.base'];
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
            ev: new fields.NumberField(),
            freeStrike: new fields.NumberField(),
            isMinion: new fields.BooleanField({
                initial: false,
            }),
            minions: new fields.NumberField(),
            isCaptain: new fields.BooleanField({
                initial: false,
            }),
            type: new fields.StringField(),
            traits: new fields.StringField(),
        };
    }
}
