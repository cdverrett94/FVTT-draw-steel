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

class TierField {
    constructor() {
        const fields = foundry.data.fields;
        const tierTypeLocalization = {
            damage: {
                type: game.i18n.localize('system.items.ability.FIELDS.power.tiers.types.damage.label'),
                amount: game.i18n.localize('system.items.ability.FIELDS.power.tiers.types.damage.amount'),
                dType: game.i18n.localize('system.items.ability.FIELDS.power.tiers.types.damage.dType'),
            },
            knockback: {
                type: game.i18n.localize('system.items.ability.FIELDS.power.tiers.types.knockback.label'),
                distance: game.i18n.localize('system.items.ability.FIELDS.power.tiers.types.knockback.distance'),
            },
            other: {
                type: game.i18n.localize('system.items.ability.FIELDS.power.tiers.types.other.label'),
                description: game.i18n.localize('system.items.ability.FIELDS.power.tiers.types.other.description'),
            },
        };

        return new fields.ArrayField(
            new fields.TypedSchemaField(
                {
                    damage: new fields.SchemaField(
                        {
                            type: new fields.StringField({
                                initial: 'damage',
                                required: true,
                                blank: false,
                                label: tierTypeLocalization.damage.type,
                            }),
                            amount: new fields.NumberField({
                                label: tierTypeLocalization.damage.amount,
                                initial: 0,
                            }),
                            dType: new fields.StringField({
                                choices: DAMAGE.TYPES,
                                label: tierTypeLocalization.damage.dType,
                                initial: 'untyped',
                            }),
                        },
                        {
                            label: tierTypeLocalization.damage.type,
                        }
                    ),
                    knockback: new fields.SchemaField(
                        {
                            type: new fields.StringField({
                                initial: 'knockback',
                                required: true,
                                blank: false,
                                label: tierTypeLocalization.knockback.type,
                            }),
                            distance: new fields.NumberField({
                                label: tierTypeLocalization.knockback.distance,
                            }),
                        },
                        {
                            label: tierTypeLocalization.knockback.type,
                        }
                    ),
                    other: new fields.SchemaField(
                        {
                            type: new fields.StringField({
                                initial: 'other',
                                required: true,
                                blank: false,
                                label: tierTypeLocalization.other.type,
                            }),
                            description: new fields.StringField({
                                label: tierTypeLocalization.other.description,
                            }),
                        },
                        {
                            label: tierTypeLocalization.other.type,
                        }
                    ),
                },
                {
                    required: false,
                    nullable: true,
                }
            ),
            {
                min: 0,
            }
        );
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
                    one: new TierField(),
                    two: new TierField(),
                    three: new TierField(),
                    four: new TierField(),
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

function hi() {
    let ability = game.items.contents.find((item) => item.type === 'ability');
    ability.update({
        system: {
            power: {
                tiers: {
                    four: [
                        {
                            type: 'damage',
                            amount: 5,
                            dType: 'fire',
                        },
                        {
                            type: 'knockback',
                            distance: 10,
                        },
                        {
                            type: 'knockback',
                            distance: 5,
                        },
                        {
                            type: 'damage',
                            amount: 5,
                            dType: 'holy',
                        },
                    ],
                },
            },
        },
    });
}
