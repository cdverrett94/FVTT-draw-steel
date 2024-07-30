import { BaseItemSheet } from './base-item.js';
export class CareerSheet extends BaseItemSheet {
    static additionalOptions = {
        classes: ['career'],
        position: {
            width: 1110,
            height: 'auto',
        },
        actions: {
            addIncident: this.addIncident,
            removeIncident: this.removeIncident,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, CareerSheet.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            details: {
                id: 'details',
                template: 'systems/mcdmrpg/templates/documents/career/career-details.hbs',
                scrollable: ['.details-tab'],
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = await super._prepareContext();

        context.constants.skills = game.mcdmrpg.skills;

        return context;
    }

    static async addIncident(event, target) {
        const incidents = this.item.system.incidents ?? [];
        incidents.push('New Incident');

        await this.item.update({ system: { incidents } });
    }

    static async removeIncident(event, target) {
        let index = Number(target.dataset.incidentIndex);
        if (typeof index !== 'number') return;

        console.log('remove incident');

        let incidents = this.item.system.incidents;
        incidents.splice(index, 1);

        await this.item.update({ system: { incidents } });

        this.setPosition({ height: 'auto' });
    }

    _prepareSubmitData(event, form, formData) {
        const object = formData.object;
        formData = super._prepareSubmitData(event, form, formData);

        const skillGrants = this.formatSkillObject(object, 'grant');
        const skillChoices = this.formatSkillObject(object, 'choice');

        formData.system.skillGrants = skillGrants;
        formData.system.skillChoices = skillChoices;

        return formData;
    }

    formatSkillObject(object, type) {
        let filteredObject = Object.entries(object).filter(([key, value], index) => key.startsWith('skills.') && key.endsWith(`.${type}`));
        filteredObject = Object.fromEntries(filteredObject);
        filteredObject = foundry.utils.expandObject(filteredObject).skills;

        let updateData = {};

        for (const category in filteredObject) {
            updateData[category] = [];
            for (const skill in filteredObject[category]) {
                if (filteredObject[category][skill][type]) updateData[category].push(skill);
            }
        }

        return updateData;
    }
}
