export class ConditionSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'condition'],
            template: `/systems/mcdmrpg/module/documents/items/condition/sheet/condition-sheet.hbs`,
            tabs: [
                /*{
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },*/
            ],
            scrollY: [
                /*'.equipment-list', '.skills-container'*/
            ],
            width: 900,
            height: 645,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = {
            name: this.item.name,
            img: this.item.img,
            effects: this.item.effects.contents,
            ...this.item.system,
        };

        // Enrich Content
        let enrichContext = {
            async: true,
        };

        // data.enrichedDescription = (await TextEditor.enrichHTML(data.description, enrichContext)) ?? '';
        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        html.querySelector('.add-effect').addEventListener('click', async (event) => {
            await this.item.createEmbeddedDocuments('ActiveEffect', [{ name: 'Active Effect', transfer: true }]);
        });

        html.querySelectorAll('.edit-effect').forEach((element) => {
            element.addEventListener('click', async (event) => {
                this.item.effects.find((effect) => effect.id === element.dataset.effectId).sheet.render(true);
            });
        });

        html.querySelectorAll('.delete-effect').forEach((element) => {
            element.addEventListener('click', async (event) => {
                this.item.deleteEmbeddedDocuments('ActiveEffect', [element.dataset.effectId]);
            });
        });
    }
}
