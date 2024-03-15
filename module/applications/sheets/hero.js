import { BaseActorSheet } from './base-actor.js';

export class HeroSheet extends BaseActorSheet {
    static additionalOptions = {
        classes: ['hero'],
        position: {
            width: 1200,
            height: 1100,
        },
        actions: {
            rollCharacteristic: HeroSheet.#rollCharacteristic,
            rollSkill: HeroSheet.#rollSkill,
            openACKSheet: HeroSheet.#openACKSheet,
            editEffect: HeroSheet.#editEffect,
            deleteEffect: HeroSheet.#deleteEffect,
        },
    };
    // overrides = {
    //     scrollY: ['.skill-list', '.tab'],
    //     resizable: true,
    // };

    tabGroups = {
        main: null,
    };
    defaultTabs = {
        main: 'abilities',
    };
    _onRender(context, options) {
        for (const [group, tab] of Object.entries(this.defaultTabs)) {
            this.changeTab(tab, group);
        }
    }

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
            },
            tabs: {
                id: 'tabs',
                template: 'systems/mcdmrpg/templates/documents/hero/tabs.hbs',
            },
        },
        { inplace: false }
    );

    static #rollCharacteristic(event, target) {
        const characteristic = target.dataset.characteristic;
        this.actor.rollCharacteristic(characteristic);
    }

    static #rollSkill(event, target) {
        let { skill, subskill } = target.dataset;
        this.actor.rollTest({ skill, subskill });
    }

    static #openACKSheet(event, target) {
        let sheetType = target.dataset.type;
        this.actor[sheetType].sheet.render(true);
    }

    static #editEffect(event, target) {
        console.log('edit effect');
        // html.querySelectorAll('.edit-effect').forEach(async (element) => {
        //             element.addEventListener('click', async (event) => {
        //                 let effect = await fromUuid(element.dataset.effectId);
        //                 effect.sheet.render(true);
        //             });
        //         });
    }

    static async #deleteEffect(event, target) {
        console.log('delete effect');
        // html.querySelectorAll('.delete-effect').forEach(async (element) => {
        //             element.addEventListener('click', async (event) => {
        //                 let effect = await fromUuid(element.dataset.effectId);
        //                 await this.actor.deleteEmbeddedDocuments('ActiveEffect', [effect.id]);
        //             });
        //         });
    }
}
