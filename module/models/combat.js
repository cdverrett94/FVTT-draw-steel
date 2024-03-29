export class CombatData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            initiative: new fields.SchemaField({
                heroes: new fields.NumberField(),
                enemies: new fields.NumberField(),
            }),
        };
    }
}
