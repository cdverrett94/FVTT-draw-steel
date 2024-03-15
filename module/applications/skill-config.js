import { CHARACTERISTICS } from '../constants/characteristics.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class SkillConfig extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);
        this.context = {};
        this.context.actor = options.actor;
    }

    get actor() {
        return this.context.actor;
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-gear',
            title: 'Configure Skills',
        },
        tag: 'form',
        classes: ['mcdmrpg', 'sheet', 'skill-config'],
        position: {
            width: 400,
            height: 'auto',
        },
        actions: {
            addSkill: SkillConfig.addSkill,
            deleteSkill: SkillConfig.deleteSkill,
        },
        form: {
            handler: this.onSubmitForm,
            submitOnChange: false,
            closeOnSubmit: false,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, SkillConfig.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        addSkills: {
            id: 'add-skill-buttons',
            template: 'systems/mcdmrpg/templates/skill-config/add-skill-buttons.hbs',
        },
        skills: {
            id: 'skills',
            template: 'systems/mcdmrpg/templates/skill-config/skills-list.hbs',
        },
        saveSkills: {
            id: 'saveSkills',
            template: 'systems/mcdmrpg/templates/skill-config/save-skills-button.hbs',
        },
    };

    async _prepareContext(options) {
        console.log('preparing context');
        return {
            actor: this.actor,
            skills: this.actor.system.skills,
            characteristics: CHARACTERISTICS,
        };
    }

    static async addSkill(event, target) {
        let skill = target.dataset.skill;
        let actor = await this.actor.addSkill({ skill, subskill: 'New ' + game.i18n.localize(`system.skills.${skill}.label`) + ' Skill' });
        this.context.actor = actor;
        await this.render({ parts: ['skills'] });
        this.setPosition({ height: 'auto' });
    }

    static async deleteSkill(event, target) {
        let skill = target.dataset.skill;
        let subskill = target.dataset.subskill;

        let actor = await this.actor.deleteSkill({ skill, subskill });
        this.context.actor = actor;
        await this.render({ parts: ['skills'] });
        this.setPosition({ height: 'auto' });
    }

    static async onSubmitForm(event, form, formData) {
        await this.actor.update(formData.object);
        this.close();
        if (this.actor.sheet.rendered) this.actor.sheet.maximize();
    }
}
