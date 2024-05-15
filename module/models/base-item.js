export class BaseItemData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            rules: new fields.ArrayField(
                new fields.SchemaField({
                    affects: new fields.StringField({
                        choices: { actor: { label: 'DOCUMENT.Actor' }, item: { label: 'DOCUMENT.Item' } },
                        initial: 'item',
                    }),
                    key: new fields.StringField(),
                    mode: new fields.NumberField(),
                    value: new fields.StringField(),
                    predicate: new fields.ArrayField(new fields.AnyField()),
                })
            ),
        };
    }
}
