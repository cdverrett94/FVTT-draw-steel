import { EditLanguagesActorSheet } from '../configs/edit-languages.js';
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
            editLanguages: this.#editLanguages,
            catchBreath: this.#catchBreath,
            spendHope: this.#spendHope,
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, HeroSheet.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/draw-steel/templates/documents/actor/hero/header.hbs',
            },
            sidebar: {
                id: 'sidebar',
                template: 'systems/draw-steel/templates/documents/actor/hero/sidebar.hbs',
            },
            details: {
                id: 'details',
                template: 'systems/draw-steel/templates/documents/actor/hero/details.hbs',
            },
            abilities: {
                id: 'abilities',
                template: 'systems/draw-steel/templates/documents/actor/partials/abilities/abilities-container.hbs',
                scrollable: ['.abilities-list'],
            },
            features: {
                id: 'features',
                template: 'systems/draw-steel/templates/documents/actor/partials/features.hbs',
                scrollable: ['.features'],
            },
            items: {
                id: 'items-tab',
                template: 'systems/draw-steel/templates/documents/actor/hero/items.hbs',
                scrollable: ['.items'],
            },
            skills: {
                id: 'skills',
                template: 'systems/draw-steel/templates/documents/actor/partials/skills/skills.hbs',
                scrollable: ['.skills-tab', '.skills'],
            },
            notes: {
                id: 'notes',
                template: 'systems/draw-steel/templates/documents/actor/partials/notes.hbs',
            },
            effects: {
                id: 'effects',
                template: 'systems/draw-steel/templates/documents/actor/partials/effects.hbs',
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

    static async #editLanguages(event, target) {
        await new EditLanguagesActorSheet({ actor: this.actor }).render(true);
    }

    static async #catchBreath(event, target) {
        const newStaminaValue = this.actor.system.stamina.current + this.actor.system.recoveries.value;
        const newRecoveriesValue = Math.clamp(this.actor.system.recoveries.current - 1, 0, this.actor.system.recoveries.max);

        await this.actor.update({ 'system.stamina.current': newStaminaValue, 'system.recoveries.current': newRecoveriesValue });
    }

    static async #spendHope(event, target) {
        const newStaminaValue = this.actor.system.stamina.current + this.actor.system.recoveries.value;
        const newHopeValue = Math.clamp(this.actor.system.hope - 1, 0, Infinity);

        await this.actor.update({ 'system.stamina.current': newStaminaValue, 'system.hope': newHopeValue });
    }
}
