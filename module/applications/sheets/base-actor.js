import { ABILITIES, CONDITIONS, DAMAGE, SKILLS } from '../../constants/_index.js';
import { SkillConfig } from '../_index.js';

const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;
export class BaseActorSheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
    constructor(...args) {
        super(...args);
        this.filters = {
            time: null,
            type: null,
        };
    }
    static additionalOptions = {
        window: {
            icon: 'fas fa-user',
            positioned: true,
            controls: [
                {
                    icon: 'fas fa-user-circle',
                    label: 'Configure Token',
                    action: 'configureToken',
                    visible: true,
                },
            ],
        },
        classes: ['mcdmrpg', 'sheet', 'actor'],
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
        },
        actions: {
            rollCharacteristic: this.#rollCharacteristic,
            editSkills: this.#editSkills,
            addAbility: this.#addAbilty,
            editAbility: this.#editAbility,
            deleteAbility: this.#deleteAbility,
            filterAbilities: this.#filterAbilities,
            toggleCondition: this.#toggleCondition,
            configureToken: this.#configureToken,
        },
    };

    get actor() {
        return this.document;
    }

    async _prepareContext(options) {
        const skills = {};
        Object.keys(SKILLS).forEach((category) => {
            if (category === 'customSkills') return false;
            for (const skill in this.actor.system.skills[category]) {
                if (this.actor.system.skills[category][skill].proficient || this.actor.system.skills[category][skill].display) {
                    skills[category] ??= {};
                    skills[category][skill] = this.actor.system.skills[category][skill];
                }
            }
        });

        const context = {
            actor: this.actor,
            actorSkills: skills,
            source: this.actor.toObject(),
            fields: this.actor.system.schema.fields,
            filters: this.filters,
            abilities: ABILITIES,
            conditions: CONDITIONS,
            damages: DAMAGE.TYPES,
            activeTabs: this.tabGroups,
        };
        // Enrich Content
        let enrichContext = {
            async: true,
            actor: this.actor,
        };
        for (const [group, abilities] of Object.entries(context.actor.abilities)) {
            for (const [index, ability] of abilities.entries()) {
                context.actor.abilities[group][index].system.enrichedEffect = await TextEditor.enrichHTML(ability.system.effect, {
                    ...enrichContext,
                    item: ability,
                });
                let isCurrentTypeFilter = ability.system.type === this.filters.type;
                let isCurrentTimeFilter = ability.system.time === this.filters.time;
                let noFilters = !this.filters.type && !this.filters.time;
                if (isCurrentTypeFilter || isCurrentTimeFilter || noFilters) ability.show = true;
                else ability.show = false;
            }
        }

        return context;
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseActorSheet.additionalOptions, { inplace: false });

    static PARTS = {};

    static #rollCharacteristic(event, target) {
        const characteristic = target.dataset.characteristic;
        this.actor.rollCharacteristic(characteristic);
    }

    static async #editSkills(event, target) {
        new SkillConfig({ actor: this.actor }).render(true);
        this.minimize();
    }

    static async #addAbilty(event, target) {
        let item = await this.actor.createEmbeddedDocuments('Item', [{ type: 'ability', name: 'New Ability' }]);
        item[0].sheet.render(true);
        this.render(true);
    }
    static #editAbility(event, target) {
        const abilityId = target.dataset.abilityId;
        const abilityItem = this.actor.items.find((item) => item._id === abilityId);

        abilityItem?.sheet.render(true);
    }
    static #deleteAbility(event, target) {
        const abilityId = target.dataset.abilityId;
        const abilityItem = this.actor.items.find((item) => item._id === abilityId);

        this.actor.deleteEmbeddedDocuments('Item', [abilityItem._id]);
    }

    static async #filterAbilities(event, target) {
        const { filter, selection } = target.dataset;
        if (selection === 'clear') {
            this.filters = {
                type: null,
                time: null,
            };
        } else {
            const secondaryFilter = filter === 'type' ? 'time' : 'type';
            this.filters[filter] = selection === 'clear' ? null : selection;
            this.filters[secondaryFilter] = null;
        }

        this.render({ parts: ['abilities'] });
    }

    static #toggleCondition(event, target) {
        const conditionId = target.dataset.conditionId;
        this.actor.toggleStatusEffect(conditionId);
    }

    static #configureToken(event, target) {
        event.preventDefault();
        const renderOptions = {
            left: Math.max(this.position.left - 560 - 10, 10),
            top: this.position.top,
        };
        if (this.actor.isToken) return this.token.sheet.render(true, renderOptions);
        else new CONFIG.Token.prototypeSheetClass(this.actor.prototypeToken, renderOptions).render(true);
    }
}
