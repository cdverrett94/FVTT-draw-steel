import { EditActorSkillsSheet } from './edits-skills-sheet.js';

export class BaseMCDMRPGActorSheet extends ActorSheet {
    constructor(...args) {
        super(...args);

        this.activeFilter = null;
    }

    static get defaultOptions() {
        return super.defaultOptions;
    }

    async getData() {
        const data = {
            name: this.actor.name,
            img: this.actor.img,
            actor: this.actor,
            ...this.actor.system,
            activeFilter: this.activeFilter,
        };

        // Enrich Content
        let enrichContext = {
            async: true,
            actor: this.actor,
        };

        for (const [group, abilities] of Object.entries(data.abilities)) {
            for (const [index, ability] of abilities.entries()) {
                data.abilities[group][index].system.enrichedDamage = await TextEditor.enrichHTML(ability.system.damage, enrichContext);
                data.abilities[group][index].system.enrichedEffect = await TextEditor.enrichHTML(ability.system.effect, enrichContext);
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

        // Ability Filter
        html.querySelectorAll('.ability-filter').forEach((element) => {
            element.addEventListener('click', (event) => {
                let abilityType = element.dataset.abilityType;
                this.activeFilter = abilityType === 'clear' ? null : abilityType;
                this.render(true);
            });
        });

        // Edit Skills
        const editSkillButton = html.querySelector('.edit-skills');
        editSkillButton.addEventListener('click', (event) => {
            const context = {
                actor: this.actor,
            };
            new EditActorSkillsSheet(this.actor).render(true);
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
    }
}
