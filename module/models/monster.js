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
        };
    }
}
