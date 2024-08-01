export class BaseItemData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            grantedFeatures: new fields.ArrayField(new fields.DocumentUUIDField()),
        };
    }
}
