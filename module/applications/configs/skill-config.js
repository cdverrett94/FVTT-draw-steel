import { CHARACTERISTICS, SKILLS } from '../../constants/_index.js';

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
        classes: ['mcdmrpg', 'sheet', 'skill-config', 'system'],
        position: {
            width: 600,
            height: 'auto',
        },
        actions: {
            addSkill: SkillConfig.addSkill,
            deleteSkill: SkillConfig.deleteSkill,
        },
        form: {
            handler: this.onSubmitForm,
            submitOnChange: true,
            closeOnSubmit: false,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, SkillConfig.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        tabs: {
            id: 'tabs',
            template: 'systems/mcdmrpg/templates/skill-config/nav-tabs.hbs',
        },
        skills: {
            id: 'skills',
            template: 'systems/mcdmrpg/templates/skill-config/category-tab.hbs',
        },
        customSkills: {
            id: 'custom-skills',
            template: 'systems/mcdmrpg/templates/skill-config/custom-skills.hbs',
        },
    };

    tabGroups = {
        main: null,
    };
    defaultTabs = {
        main: 'crafting',
    };

    _onRender(context, options) {
        for (const [group, tab] of Object.entries(this.tabGroups)) {
            if (tab === null) this.changeTab(this.defaultTabs[group], group, { force: true });
            else this.changeTab(tab, group, { force: true });
        }
    }

    async _prepareContext(options) {
        return {
            actor: this.actor,
            skillsList: SKILLS,
            skills: this.actor.system.toObject().skills,
            characteristics: CHARACTERISTICS,
        };
    }

    static async addSkill() {
        const actor = await this.actor.addCustomSkill();
        this.context.actor = actor;
        await this.render({ parts: ['customSkills'] });
        this.setPosition({ height: 'auto' });
    }

    static async deleteSkill(event, target) {
        const index = target.dataset.index;

        const actor = await this.actor.deleteCustomSkill({ index });
        this.context.actor = actor;
        await this.render({ parts: ['customSkills'] });
        this.setPosition({ height: 'auto' });
    }

    static async onSubmitForm(event, form, formData) {
        const actor = await this.actor.update(foundry.utils.expandObject(formData.object));
    }

    _onClose() {
        if (this.actor.sheet.rendered) this.actor.sheet.maximize();
    }
}
