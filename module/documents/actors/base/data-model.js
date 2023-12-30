export class MCDMActorData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            characteristics: new fields.SchemaField({
                might: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                agility: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                endurance: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                reason: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                intuition: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
                presence: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: -5,
                    max: 10,
                    integer: true,
                    nullable: false,
                }),
            }),
            hp: new fields.SchemaField({
                current: new fields.NumberField({
                    required: true,
                    initial: 0,
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
            size: new fields.SchemaField({
                width: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
                length: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
                height: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
                weight: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                    nullable: false,
                }),
            }),
            level: new fields.NumberField({
                required: true,
                initial: 1,
                integer: true,
            }),
        };
    }
}
