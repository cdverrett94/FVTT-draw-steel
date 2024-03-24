import { ABILITIES, CHARACTERISTICS, DAMAGE } from '../constants/_index.js';
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
    static LOCALIZATION_PREFIXES = ['system.items.ability'];
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            cost: new fields.StringField({
                label: ABILITIES.FIELDS.cost.label,
            }),
            damage: new fields.SchemaField(
                {
                    doesDamage: new fields.BooleanField({
                        initial: false,
                    }),
                    baseFormula: new fields.StringField({
                        initial: '2d6',
                    }),
                    characteristic: new fields.StringField({
                        choices: getDataModelChoices(CHARACTERISTICS),
                    }),
                    applyExtraDamage: new fields.BooleanField({}),
                    banes: new fields.NumberField({
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                    boons: new fields.NumberField({
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                    impacts: new fields.NumberField({
                        initial: 0,
                        integer: true,
                        min: 0,
                    }),
                    type: new fields.StringField({
                        choices: getDataModelChoices(DAMAGE.TYPES),
                    }),
                },
                {
                    label: ABILITIES.FIELDS.damage.label,
                }
            ),
            distance: new fields.StringField({
                label: ABILITIES.FIELDS.distance.label,
            }),
            effect: new fields.StringField({
                label: game.i18n.localize(ABILITIES.FIELDS.effect.label),
            }),
            keywords: new KeywordField(
                new fields.StringField({
                    nullable: true,
                    choices: getDataModelChoices(ABILITIES.KEYWORDS),
                }),
                {
                    label: ABILITIES.FIELDS.keywords.label,
                }
            ),
            target: new fields.StringField({
                label: ABILITIES.FIELDS.target.label,
            }),
            time: new fields.StringField({
                choices: getDataModelChoices(ABILITIES.TIMES),
                label: ABILITIES.FIELDS.time.label,
            }),
            trigger: new fields.StringField({
                label: ABILITIES.FIELDS.trigger.label,
            }),
            type: new fields.StringField({
                choices: getDataModelChoices(ABILITIES.TYPES),
                label: ABILITIES.FIELDS.type.label,
            }),
        };
    }
}
