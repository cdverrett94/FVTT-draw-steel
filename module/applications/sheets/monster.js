import { MONSTER_ROLES, NEGOTIATION } from '../../constants/_index.js';
import { BaseActorSheet } from './base-actor.js';

export class MonsterSheet extends BaseActorSheet {
    static additionalOptions = {
        classes: ['monster'],
        position: {
            width: 800,
            height: 'auto',
        },
        actions: {},
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/mcdmrpg/templates/documents/actor/monster/header.hbs',
            },
            tabs: {
                id: 'tabs',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/tabs.hbs',
            },
            abilities: {
                id: 'abilities',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/abilities/abilities-container.hbs',
                scrollable: ['.abilities-list'],
            },
            skills: {
                id: 'skills',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/skills/skills.hbs',
                scrollable: ['.skills-tab', '.skills'],
            },
            notes: {
                id: 'notes',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/notes.hbs',
            },
            effects: {
                id: 'effects',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/effects.hbs',
            },
            negotiation: {
                id: 'negotiation',
                template: 'systems/mcdmrpg/templates/documents/actor/monster/negotiation.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        let context = foundry.utils.mergeObject(
            await super._prepareContext(),
            {
                constants: {
                    negotiation: NEGOTIATION,
                },
            },
            { inplace: false }
        );

        context.monsterRoles = MONSTER_ROLES;
        let proficientSkills = {};
        for (const [skill, context] of Object.entries(this.actor.system.skills)) {
            if (['craft', 'knowledge'].includes(skill)) {
                let specialSkills = context.filter((subskill) => subskill.proficient === true);
                if (specialSkills.length) proficientSkills[skill] = specialSkills;
            } else {
                if (context.proficient) proficientSkills[skill] = context;
            }
        }
        context.proficientSkills = proficientSkills;
        context.widgets = {
            pitfalls: this.createPitfallsField.bind(this),
        };

        if (this.actor.system.isMinion) {
            context.minions = {
                current: Math.ceil(this.actor.system.stamina.current / this.actor.system.stamina.max),
                max: this.actor.system.minions,
            };
        }
        return context;
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        if (partId === 'negotiation') {
            htmlElement.querySelectorAll('multi-select').forEach((element) => {
                element.addEventListener('change', (event) => {
                    this.element.requestSubmit();
                });
            });
        }
    }

    createPitfallsField() {
        let div = document.createElement('div');
        div.classList.add('form-group');

        let label = document.createElement('label');
        label.innerText = game.i18n.localize('system.actors.monster.FIELDS.negotiation.pitfalls.label');
        div.append(label);

        let formFields = document.createElement('div');
        formFields.classList.add('form-fields');

        let multiSelect = document.createElement('multi-select');
        multiSelect.setAttribute('name', 'system.negotiation.pitfalls');

        const monsterSkills = this.actor.system.skills;
        Object.entries(monsterSkills).forEach((categoryObject) => {
            const [category, skills] = categoryObject;
            if (category === 'customSkills') return;
            let optgroup = document.createElement('optgroup');
            optgroup.setAttribute('label', game.i18n.localize(`system.skills.${category}.label`));

            Object.entries(skills).forEach((skillsObject) => {
                const [skill, data] = skillsObject;
                let option = document.createElement('option');
                option.setAttribute('value', skill);
                option.innerText = data.isCustom ? data.label : game.i18n.localize(`system.skills.${category}.${skill}.label`);
                if (this.actor.system.negotiation.pitfalls.has(skill)) {
                    option.setAttribute('selected', true);
                    option.setAttribute('disabled', true);
                }

                optgroup.append(option);
            });

            multiSelect.append(optgroup);
        });
        formFields.append(multiSelect);
        div.append(formFields);

        return div;
    }
}
