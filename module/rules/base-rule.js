const ruleTypes = ['addDamage'];

class Rule extends foundry.abstract.DataModel {
    defineSchema() {
        const fields = foundry.data.fields;
        return {
            type: new fields.StringField({
                choices: ruleTypes,
            }),
            predicate: new fields.ArrayField(new fields.AnyField()),
        };
    }
}

class AddDamageRule extends Rule {}
