import { ABILITIES, CHARACTERISTICS } from '../constants/_index.js';
import { getDataModelChoices } from '../helpers.js';
import { BaseItemData } from './base-item.js';

class KeywordField extends foundry.data.fields.ArrayField {
    toFormGroup(inputConfig = {}, groupConfig = {}, customInput) {
        let outerDiv = document.createElement('div');
        outerDiv.classList.add('form-group');
        outerDiv.classList.add('ability-keywords');
        for (const choice in this.element.choices) {
            const choiceDiv = document.createElement('div');
            choiceDiv.classList.add('ability-keyword');

            const choiceInput = document.createElement('input');
            choiceInput.setAttribute('type', 'checkbox');
            choiceInput.setAttribute('id', `${choice}-keyword`);
            choiceInput.setAttribute('value', choice);
            choiceInput.setAttribute('name', 'system.keywords');
            if (groupConfig.value?.includes(choice)) choiceInput.setAttribute('checked', 'checked');
            choiceDiv.appendChild(choiceInput);

            const choiceLabel = document.createElement('label');
            choiceLabel.setAttribute('for', `${choice}-keyword`);
            choiceLabel.innerText += game.i18n.localize(this.element.choices[choice]);
            choiceDiv.appendChild(choiceLabel);

            outerDiv.appendChild(choiceDiv);
        }
        return outerDiv;
    }
}

export class AbilityData extends BaseItemData {
    static LOCALIZATION_PREFIXES = ['system.items.ability', 'system.general'];
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            cost: new fields.StringField(),
            power: new fields.SchemaField({
                characteristic: new fields.StringField({
                    choices: getDataModelChoices(CHARACTERISTICS),
                }),
                tiers: new fields.SchemaField({
                    one: new fields.StringField(),
                    two: new fields.StringField(),
                    three: new fields.StringField(),
                }),
            }),
            distance: new fields.StringField(),
            effect: new fields.HTMLField(),
            keywords: new KeywordField(
                new fields.StringField({
                    nullable: true,
                    choices: getDataModelChoices(ABILITIES.KEYWORDS),
                })
            ),
            target: new fields.StringField(),
            time: new fields.StringField({
                choices: getDataModelChoices(ABILITIES.TIMES),
            }),
            trigger: new fields.StringField(),
            type: new fields.StringField({
                choices: getDataModelChoices(ABILITIES.TYPES),
            }),
        };
    }
}
