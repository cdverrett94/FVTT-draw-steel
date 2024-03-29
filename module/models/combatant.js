export class CombatantData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            turnCompleted: new fields.BooleanField(),
        };
    }
}
