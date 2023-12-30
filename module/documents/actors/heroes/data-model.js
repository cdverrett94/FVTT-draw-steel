import { MCDMActorData } from '../base/data-model.js';

export class HeroData extends MCDMActorData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            victories: new fields.NumberField({
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                nullable: false,
            }),
            xp: new fields.NumberField({
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                nullable: false,
            }),
            recoveries: new fields.SchemaField({
                current: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                }),
                max: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                }),
            }),
            currentResources: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField(),
                    current: new fields.NumberField(),
                })
            ),
        };
    }
}
