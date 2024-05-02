export class ChatMessageData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            origin: new fields.SchemaField({
                item: new fields.DocumentUUIDField(),
                actor: new fields.DocumentUUIDField(),
            }),
            context: new fields.SchemaField({
                critical: new fields.BooleanField(),
            }),
        };
    }
}
