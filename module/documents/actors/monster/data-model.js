import { monsterRoles } from '../../../constants.js';
import { MCDMActorData } from '../base/data-model.js';

export class MonsterData extends MCDMActorData {
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
        };
    }
}
