export class EditActorSkillsSheet extends FormApplication {
    constructor(...args) {
        super(...args);
    }

    get context() {
        return this.options.context;
    }

    get actor() {
        return this.object;
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'edit-skills'],
            template: `/systems/mcdmrpg/templates/documents/actors/base/partials/edit-skills.hbs`,
            submitOnChange: true,
            closeOnSubmit: false,
            width: 400,
            height: 'auto',
            resizable: true,
            title: `Edit Skills`,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = {
            actor: this.actor,
            skills: this.actor.system.skills,
        };

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        // Add Crafting & Knowledge Skills
        html.querySelectorAll('.add-skill').forEach((element) => {
            element.addEventListener('click', async (event) => {
                let skill = element.dataset.skill;
                let actor = await this.actor.addSkill({ skill, subskill: 'New ' + game.i18n.localize(`mcdmrpg.skills.${skill}.label`) + ' Skill' });
                this.object = actor;
                this.render(true);
            });
        });

        // Delete Crafting & Knowledge Skills
        html.querySelectorAll('.delete-skill > i').forEach((element) => {
            element.addEventListener('click', async (event) => {
                let skill = element.dataset.skill;
                let subskill = element.dataset.subskill;

                let actor = await this.actor.deleteSkill({ skill, subskill });
                this.object = actor;
                this.render(true);
            });
        });
    }

    async _updateObject(event, formData) {
        if (!this.object.id) return;
        return this.object.update(formData);
    }

    async _onSubmit(options = {}) {
        await super._onSubmit(options);

        this.render(true);
    }
}
