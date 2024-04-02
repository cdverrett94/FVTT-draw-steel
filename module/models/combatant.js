export class CombatantData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            turns: new fields.SchemaField({
                left: new fields.NumberField(),
            }),
        };
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.turns.total = this.parent.actor.system.combat.turns ?? 0;
    }
}
