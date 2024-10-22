import { BaseItemSheet } from './base-item.js';

export class CultureSheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['culture'],
        position: {
            width: 1000,
            height: 1000,
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, CultureSheet.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            details: {
                id: 'details',
                template: 'systems/draw-steel/templates/documents/culture/culture-details.hbs',
            },
            skills: {
                id: 'skills',
                template: 'systems/draw-steel/templates/documents/culture/culture-skills.hbs',
                scrollable: ['.skills'],
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.constants.skills = game['draw-steel'].skills;

        return context;
    }

    _prepareSubmitData(event, form, formData) {
        const object = formData.object;
        formData = super._prepareSubmitData(event, form, formData);

        let filteredObject = Object.entries(object).filter(([key, value], index) => key.startsWith('skills.'));
        filteredObject = Object.fromEntries(filteredObject);
        filteredObject = foundry.utils.expandObject(filteredObject).skills;

        let updateData = {};

        for (const category in filteredObject) {
            updateData[category] = [];
            for (const skill in filteredObject[category]) {
                if (filteredObject[category][skill]) updateData[category].push(skill);
            }
        }

        formData.system.skills = updateData;

        return formData;
    }
}
