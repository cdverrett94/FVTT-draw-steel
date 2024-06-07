import { BaseActorSheet } from './base-actor.js';

export class HeroSheet extends BaseActorSheet {
    static additionalOptions = {
        classes: ['hero'],
        position: {
            width: 1202,
            height: 1100,
        },
        actions: {
            rollSkill: this.#rollSkill,
            addSkill: this.#addSkill,
            deleteSkill: this.#deleteSkill,
            openACKSheet: this.#openACKSheet,
            editEffect: this.#editEffect,
            deleteEffect: this.#deleteEffect,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, HeroSheet.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/mcdmrpg/templates/documents/hero/header.hbs',
            },
            sidebar: {
                id: 'sidebar',
                template: 'systems/mcdmrpg/templates/documents/hero/sidebar.hbs',
            },
            skills: {
                id: 'skill',
                template: 'systems/mcdmrpg/templates/documents/hero/skills.hbs',
                scrollable: ['.skill-list'],
            },
            details: {
                id: 'details',
                template: 'systems/mcdmrpg/templates/documents/hero/details.hbs',
            },
            abilities: {
                id: 'abilities',
                template: 'systems/mcdmrpg/templates/documents/partials/actor-abilities-container.hbs',
                scrollable: ['.abilities-list'],
            },
            skillst: {
                id: 'skillst',
                template: 'systems/mcdmrpg/templates/documents/hero/skillst.hbs',
                scrollable: ['.skills-tab', '.skills'],
            },
            notes: {
                id: 'notes',
                template: 'systems/mcdmrpg/templates/documents/hero/notes.hbs',
            },
            effects: {
                id: 'effects',
                template: 'systems/mcdmrpg/templates/documents/hero/effects.hbs',
            },
        },
        { inplace: false }
    );

    static #rollSkill(event, target) {
        let { skill, category } = target.dataset;
        this.actor.rollSkillTest({ skill, category });
    }

    static async #addSkill() {
        await this.actor.addCustomSkill();
        await this.render({ parts: ['skillst'] });
        this.setPosition({ height: 'auto' });
    }

    static async #deleteSkill(event, target) {
        const index = target.dataset.index;

        await this.actor.deleteCustomSkill({ index });
        await this.render({ parts: ['skillst'] });
        this.setPosition({ height: 'auto' });
    }

    static #openACKSheet(event, target) {
        let sheetType = target.dataset.type;
        this.actor[sheetType].sheet.render(true);
    }

    static async #editEffect(event, target) {
        let effect = await fromUuid(element.dataset.effectId);
        effect.sheet.render(true);
    }

    static async #deleteEffect(event, target) {
        let effect = await fromUuid(element.dataset.effectId);
        await this.actor.deleteEmbeddedDocuments('ActiveEffect', [effect.id]);
    }
}
