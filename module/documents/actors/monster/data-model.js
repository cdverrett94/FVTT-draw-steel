import { MCDMActorData } from '../base/data-model.js';

export class MonsterData extends MCDMActorData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            group: new fields.StringField(),
            bonusDamage: new fields.NumberField(),
        };
    }
}
