export class AbilityMessagesData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            abilityUuid: new fields.DocumentUUIDField(),
            actor: new fields.ForeignDocumentField(Actor),
            critical: new fields.BooleanField(),
            title: new fields.StringField(),
        };
    }
}
