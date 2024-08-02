import { BaseActorSheet } from './base-actor.js';

export class HeroSheet extends BaseActorSheet {
    static additionalOptions = {
        classes: ['hero'],
        position: {
            width: 1010,
            height: 735,
        },
        actions: {
            rollSkill: this.#rollSkill,
            openACKSheet: this.#openACKSheet,
            editEffect: this.#editEffect,
            deleteEffect: this.#deleteEffect,
            editItem: this.#editItem,
            deleteItem: this.#deleteItem,
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
                template: 'systems/mcdmrpg/templates/documents/actor/hero/header.hbs',
            },
            sidebar: {
                id: 'sidebar',
                template: 'systems/mcdmrpg/templates/documents/actor/hero/sidebar.hbs',
            },
            details: {
                id: 'details',
                template: 'systems/mcdmrpg/templates/documents/actor/hero/details.hbs',
            },
            abilities: {
                id: 'abilities',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/abilities/abilities-container.hbs',
                scrollable: ['.abilities-list'],
            },
            features: {
                id: 'features',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/features.hbs',
            },
            items: {
                id: 'items',
                template: 'systems/mcdmrpg/templates/documents/actor/hero/items.hbs',
            },
            skills: {
                id: 'skills',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/skills/skills.hbs',
                scrollable: ['.skills-tab', '.skills'],
            },
            notes: {
                id: 'notes',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/notes.hbs',
            },
            effects: {
                id: 'effects',
                template: 'systems/mcdmrpg/templates/documents/actor/partials/effects.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = await super._prepareContext(options);

        context.enriched ??= {};

        const enrichContext = {
            async: true,
            actor: this.actor,
        };
        context.enriched.notes = await TextEditor.enrichHTML(context.source.system.notes, enrichContext);

        return context;
    }

    static #rollSkill(event, target) {
        let { skill, category } = target.dataset;
        this.actor.rollSkillTest({ skill, category });
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

    static async #editItem(event, target) {
        const { itemId } = target.dataset;
        const item = this.actor.items.find((item) => item.id === itemId);
        await item.sheet.render(true);
    }

    static async #deleteItem(event, target) {
        const { itemId } = target.dataset;
        await this.actor.deleteEmbeddedDocuments('Item', [itemId]);
    }
}
