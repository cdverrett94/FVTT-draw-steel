import { BaseItemSheet } from './base-item.js';

export class ClassSheet extends BaseItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'item', 'class'],
            template: `/systems/mcdmrpg/templates/documents/class/class-sheet.hbs`,
            width: 900,
            height: 'auto',
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = await super.getData();

        // Enrich Content
        let enrichContext = {
            async: true,
        };

        data.source.system.description = (await TextEditor.enrichHTML(data.source.system.description, enrichContext)) ?? '';
        data.source.system.victoryBenefits = (await TextEditor.enrichHTML(data.source.system.victoryBenefits, enrichContext)) ?? '';
        data.source.system.resourceGain = (await TextEditor.enrichHTML(data.source.system.resourceGain, enrichContext)) ?? '';

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
}
