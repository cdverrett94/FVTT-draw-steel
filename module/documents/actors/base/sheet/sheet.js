export class BaseMCDMRPGActorSheet extends ActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        return super.defaultOptions;
    }

    async getData() {
        const data = {
            name: this.actor.name,
            img: this.actor.img,
            ...this.actor.system,
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
