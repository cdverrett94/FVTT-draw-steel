import { BaseItemSheet } from './base-item.js';
export class ClassSheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['class'],
        position: {
            width: 900,
            height: 755,
        },
        actions: {
            addResource: ClassSheet.#addResource,
            deleteResource: ClassSheet.#deleteResource,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, ClassSheet.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/mcdmrpg/templates/documents/partials/item-header.hbs',
            },
            resources: {
                id: 'resources',
                template: 'systems/mcdmrpg/templates/documents/class/class-resources.hbs',
            },
            details: {
                id: 'details',
                template: 'systems/mcdmrpg/templates/documents/class/class-details.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = await super._prepareContext();

        // Enrich Content
        let enrichContext = {
            async: true,
        };

        context.item.system.description = (await TextEditor.enrichHTML(context.item.system.description, enrichContext)) ?? '';
        context.item.system.victoryBenefits = (await TextEditor.enrichHTML(context.item.system.victoryBenefits, enrichContext)) ?? '';
        context.item.system.reitemGain = (await TextEditor.enrichHTML(context.item.system.resourceGain, enrichContext)) ?? '';

        return context;
    }

    static async #deleteResource(event, target) {
        let index = Number(target.dataset.resourceIndex);
        if (typeof index !== 'number') return;

        let resources = this.item.system.resources;
        resources.splice(index, 1);
        await this.item.update({ 'system.resources': resources });
    }

    static async #addResource() {
        let resources = this.item.system.resources ?? [];
        resources.push({ name: 'New Resource', max: '' });
        await this.item.update({ 'system.resources': resources });
    }
}
