import { CHARACTERISTICS } from '../../constants/characteristics.js';
import { SKILLS } from '../../constants/skills.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class CustomSkillsSettings extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(...args) {
        super(...args);

        this.customSkills = game.settings.get('draw-steel', 'customSkills') ?? [];
    }
    static additionalOptions = {
        window: {
            icon: 'fas fa-user',
            positioned: true,
            resizable: true,
        },
        position: {
            width: 400,
        },
        classes: ['draw-steel', 'settings', 'customSkills', 'system'],
        tag: 'form',
        form: {
            closeOnSubmit: false,
            submitOnChange: false,
            handler: this.#updateCustomSkills,
        },
        actions: {
            addSkill: this.#addSkill,
            deleteSkill: this.#deleteSkill,
        },
    };
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            customSkills: {
                id: 'customSkills',
                template: 'systems/draw-steel/templates/settings/custom-skills.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const additionalContext = {
            customSkills: this.customSkills,
            constants: {
                skills: SKILLS,
                characteristics: CHARACTERISTICS,
            },
        };

        const context = foundry.utils.mergeObject(await super._prepareContext(options), additionalContext, { inplace: false });

        return context;
    }

    static #addSkill(event, target) {
        this.customSkills.push({
            category: 'crafting',
            characteristic: 'might',
            name: 'New Skill',
        });

        this.render();
    }

    static #deleteSkill(event, target) {
        const { index } = target.dataset;

        this.customSkills.splice(index, 1);

        this.render();
    }

    static async #updateCustomSkills(event, form, data) {
        data = foundry.utils.expandObject(data.object);
        const customSkills = [];
        for (const index in data.customSkills) {
            customSkills.push(data.customSkills[index]);
        }

        await game.settings.set('draw-steel', 'customSkills', customSkills);
    }
}
