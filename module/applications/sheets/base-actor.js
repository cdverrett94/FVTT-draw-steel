import { ABILITIES } from '../../constants/abilities.js';
import { mcdmConditions } from '../../hooks/init/register-status-effects.js';
import { SkillConfig } from '../skill-config.js';

export class BaseActorSheet extends ActorSheet {
    constructor(...args) {
        super(...args);

        this.filters = {
            time: null,
            type: null,
        };
    }

    async getData() {
        const data = {
            actor: this.actor,
            source: this.actor.toObject(),
            fields: this.actor.system.schema.fields,
            filters: this.filters,
            abilities: ABILITIES,

            ...this.actor.system,
            conditionsList: mcdmConditions,
        };

        // Enrich Content
        let enrichContext = {
            async: true,
            actor: this.actor,
        };

        for (const [group, abilities] of Object.entries(data.actor.abilities)) {
            for (const [index, ability] of abilities.entries()) {
                let damageText;
                if (ability.system.damage.doesDamage) {
                    let { baseFormula, characteristic, boons, banes, impacts, type, applyExtraDamage } = ability.system.damage;
                    damageText = `@Damage[${baseFormula}|characteristic=${characteristic}|boons=${boons}|banes=${banes}|impacts=${impacts}|type=${type}|applyExtraDamage=${applyExtraDamage}]`;
                }

                data.actor.abilities[group][index].system.enrichedDamage = await TextEditor.enrichHTML(damageText, { ...enrichContext, item: ability });
                data.actor.abilities[group][index].system.enrichedEffect = await TextEditor.enrichHTML(ability.system.effect, {
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

        data.chanceHit = await TextEditor.enrichHTML(data.chanceHit, enrichContext);

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        // Add Ability
        const addAbilityButton = html.querySelector('.add-ability');
        addAbilityButton.addEventListener('click', async (event) => {
            let item = await this.actor.createEmbeddedDocuments('Item', [{ type: 'ability', name: 'New Ability' }]);
            item[0].sheet.render(true);
            this.render(true);
        });

        // Ability Filters
        html.querySelectorAll('.ability-filter').forEach((element) => {
            element.addEventListener('click', (event) => {
                const filter = element.dataset.filter;
                const selection = element.dataset.filterSelection;
                const secondaryFilter = filter === 'type' ? 'time' : 'type';

                this.filters[filter] = selection === 'clear' ? null : selection;
                this.filters[secondaryFilter] = null;

                this.render(true);
            });
        });

        // Edit Skills
        const editSkillButton = html.querySelector('.edit-skills');
        editSkillButton.addEventListener('click', (event) => {
            new SkillConfig({ actor: this.actor }).render(true);
        });

        // Edit Ability
        html.querySelectorAll('.ability-edit').forEach((element) => {
            element.addEventListener('click', (event) => {
                let abilityData = element.closest('.ability').dataset;
                let ability = this.actor.items.find((item) => item._id === abilityData.abilityId);

                ability?.sheet.render(true);
            });
        });

        // Delete Ability
        html.querySelectorAll('.ability-delete').forEach((element) => {
            element.addEventListener('click', (event) => {
                let abilityData = element.closest('.ability').dataset;
                let ability = this.actor.items.find((item) => item._id === abilityData.abilityId);

                this.actor.deleteEmbeddedDocuments('Item', [ability._id]);
            });
        });

        // Toggle Conditions
        html.querySelectorAll('.toggle-condition').forEach(async (element) => {
            element.addEventListener('click', async (event) => {
                const conditionId = element.dataset.conditionId;
                this.actor.toggleStatusEffect(conditionId);
            });
        });
    }
}
