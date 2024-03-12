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
        classes: ['mcdmrpg', 'sheet', 'skill-config'],
        position: {
            width: 400,
            height: 'auto',
        },
        actions: {
            addSkill: SkillConfig.addSkill,
            deleteSkill: SkillConfig.deleteSkill,
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
        configureSkills: {
            id: 'content',
            template: 'systems/mcdmrpg/templates/skill-config/skills-list.hbs',
            forms: {
                '.skill-config-form': SkillConfig.onSubmitForm,
            },
        },
    };

    async _prepareContext(options) {
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
        this.render(true);
    }

    static async deleteSkill(event, target) {
        let skill = target.dataset.skill;
        let subskill = target.dataset.subskill;

        let actor = await this.actor.deleteSkill({ skill, subskill });
        this.context.actor = actor;
        this.render(true);
    }

    static async onSubmitForm(event, form, formData) {
        await this.actor.update(formData.object);
        this.render(true);
        this.close();
    }
}
