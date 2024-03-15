// export class BaseActorSheet extends ActorSheet {

import { ABILITIES } from '../../constants/abilities.js';
import { CONDITIONS } from '../../constants/conditions.js';
import { SkillConfig } from '../skill-config.js';

//     activateListeners($html) {
//         super.activateListeners($html);
//         const html = $html[0];

//         // Add Ability
//         const addAbilityButton = html.querySelector('.add-ability');
//         addAbilityButton.addEventListener('click', async (event) => {
//             let item = await this.actor.createEmbeddedDocuments('Item', [{ type: 'ability', name: 'New Ability' }]);
//             item[0].sheet.render(true);
//             this.render(true);
//         });

//         // Ability Filters
//         html.querySelectorAll('.ability-filter').forEach((element) => {
//             element.addEventListener('click', (event) => {
//                 const filter = element.dataset.filter ?? 'type';
//                 const selection = element.dataset.filterSelection;
//                 const secondaryFilter = filter === 'type' ? 'time' : 'type';

//                 this.filters[filter] = selection === 'clear' ? null : selection;
//                 this.filters[secondaryFilter] = null;

//                 this.render(true);
//             });
//         });

//         // Edit Skills
//         const editSkillButton = html.querySelector('.edit-skills');
//         editSkillButton.addEventListener('click', (event) => {
//             new SkillConfig({ actor: this.actor }).render(true);
//         });

//         // Edit Ability
//         html.querySelectorAll('.ability-edit').forEach((element) => {
//             element.addEventListener('click', (event) => {
//                 let abilityData = element.closest('.ability').dataset;
//                 let ability = this.actor.items.find((item) => item._id === abilityData.abilityId);

//                 ability?.sheet.render(true);
//             });
//         });

//         // Delete Ability
//         html.querySelectorAll('.ability-delete').forEach((element) => {
//             element.addEventListener('click', (event) => {
//                 let abilityData = element.closest('.ability').dataset;
//                 let ability = this.actor.items.find((item) => item._id === abilityData.abilityId);

//                 this.actor.deleteEmbeddedDocuments('Item', [ability._id]);
//             });
//         });

//         // Toggle Conditions
//         html.querySelectorAll('.toggle-condition').forEach(async (element) => {
//             element.addEventListener('click', async (event) => {
//                 const conditionId = element.dataset.conditionId;
//                 this.actor.toggleStatusEffect(conditionId);
//             });
//         });
//     }
// }

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
        },
        classes: ['mcdmrpg', 'sheet', 'actor'],
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
        },
        actions: {
            editSkills: this.#editSkills,
            addAbility: this.#addAbilty,
            editAbility: this.#editAbility,
            deleteAbility: this.#deleteAbility,
            filterAbilities: this.#filterAbilities,
            toggleCondition: this.#toggleCondition,
        },
    };

    get actor() {
        return this.document;
    }

    async _prepareContext(options) {
        const context = {
            actor: this.actor,
            source: this.actor.toObject(),
            fields: this.actor.system.schema.fields,
            filters: this.filters,
            abilities: ABILITIES,
            conditions: CONDITIONS,
        };
        // Enrich Content
        let enrichContext = {
            async: true,
            actor: this.actor,
        };
        for (const [group, abilities] of Object.entries(context.actor.abilities)) {
            for (const [index, ability] of abilities.entries()) {
                let damageText;
                if (ability.system.damage.doesDamage) {
                    let { baseFormula, characteristic, boons, banes, impacts, type, applyExtraDamage } = ability.system.damage;
                    damageText = `@Damage[${baseFormula}|characteristic=${characteristic}|boons=${boons}|banes=${banes}|impacts=${impacts}|type=${type}|applyExtraDamage=${applyExtraDamage}]`;
                }
                context.actor.abilities[group][index].system.enrichedDamage = await TextEditor.enrichHTML(damageText, { ...enrichContext, item: ability });
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
        context.actor.system.chanceHit = await TextEditor.enrichHTML(context.actor.system.chanceHit, enrichContext);
        return context;
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseActorSheet.additionalOptions, { inplace: false });

    static PARTS = {};

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

        this.render(true);
    }

    static #toggleCondition(event, target) {
        console.log('condition toggle');
        const conditionId = target.dataset.conditionId;
        this.actor.toggleStatusEffect(conditionId);
    }
}
