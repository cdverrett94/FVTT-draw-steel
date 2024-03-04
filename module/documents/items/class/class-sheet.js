export class ClassSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'class'],
            template: `/systems/mcdmrpg/templates/documents/items/class/class-sheet.hbs`,
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
            ...this.item.system,
        };
        // Enrich Content
        let enrichContext = {
            async: true,
        };

        data.enrichedDescription = (await TextEditor.enrichHTML(data.description, enrichContext)) ?? '';
        data.enrichedVictoryBenefits = (await TextEditor.enrichHTML(data.victoryBenefits, enrichContext)) ?? '';
        data.enrichedResourceGain = (await TextEditor.enrichHTML(data.resourceGain, enrichContext)) ?? '';
        return data;
    }

    deleteResource(index) {
        let resources = this.object.system.resources;
        resources.splice(index, 1);
        this.object.update({ 'system.resources': resources });
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        html.querySelector('.add-class-resource').addEventListener('click', (event) => {
            let resources = this.object.system.resources ?? [];
            resources.push({ name: 'New Resource', max: '' });
            this.object.update({ 'system.resources': resources });
        });

        html.querySelectorAll('.delete-class-resource').forEach((element) => {
            element.addEventListener('click', (event) => {
                let index = Number(element.dataset.resourceIndex);
                if (typeof index === 'number') this.deleteResource(index);
            });
        });
    }

    _getSubmitData(updateData = {}) {
        let submitData = super._getSubmitData(updateData);

        return submitData;
    }
}
