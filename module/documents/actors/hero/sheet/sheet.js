import { BaseMCDMRPGActorSheet } from '../../base/sheet/sheet.js';

export class HeroSheet extends BaseMCDMRPGActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'actor', 'hero'],
            template: `/systems/mcdmrpg/module/documents/actors/hero/sheet/hero-sheet.hbs`,
            tabs: [
                {
                    navSelector: '.sheet-tabs',
                    contentSelector: '.tabbed-content',
                    initial: 'abilities',
                },
            ],
            scrollY: ['.skill-list', '.tabbed-content'],
            width: 1230,
            height: 930,
            resizable: true,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        let data = await super.getData();
        data.activeEffects = this.actor.appliedEffects;
        data.inactiveEffects = this.actor.effects.filter((effect) => effect.disabled);

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        // Roll Characteristic
        html.querySelectorAll('.characteristic .mcdmrpg-subheader').forEach((element) => {
            element.addEventListener('click', (event) => {
                let characteristic = element.closest('.characteristic').dataset.characteristic;
                this.actor.rollCharacteristic(characteristic);
            });
        });

        // Roll Skill
        html.querySelectorAll('.roll-skill').forEach((element) => {
            element.addEventListener('click', (event) => {
                let skill = element.dataset.skill;
                let subskill = element.dataset.subskill;
                this.actor.rollTest({ skill, subskill });
            });
        });

        // Add Crafting & Knowledge Skills
        html.querySelectorAll('.add-skill').forEach((element) => {
            element.addEventListener('click', (event) => {
                let skill = element.dataset.skill;
                this.actor.addSkill({ skill, subskill: 'New ' + game.i18n.localize(`skills.${skill}.label`) + ' Skill' });
            });
        });

        // Delete Crafting & Knowledge Skills
        html.querySelectorAll('.delete-skill > i').forEach((element) => {
            element.addEventListener('click', (event) => {
                let skill = element.dataset.skill;
                let subskill = element.dataset.subskill;
                this.actor.deleteSkill({ skill, subskill });
            });
        });

        html.querySelectorAll('.kit, .class, .ancestry').forEach((element) => {
            element.addEventListener('click', (event) => {
                this.actor.system[element.dataset.type].sheet.render(true);
            });
        });

        // Edit and Delete Conditions
        html.querySelectorAll('.edit-condition').forEach((element) => {
            element.addEventListener('click', async (event) => {
                this.actor.system.conditions.find((condition) => condition.id === element.dataset.conditionId).sheet.render(true);
            });
        });

        html.querySelectorAll('.delete-condition').forEach((element) => {
            element.addEventListener('click', async (event) => {
                await this.actor.deleteEmbeddedDocuments('Item', [element.dataset.conditionId]);
            });
        });

        html.querySelectorAll('.edit-effect').forEach(async (element) => {
            element.addEventListener('click', async (event) => {
                let effect = await fromUuid(element.dataset.effectId);
                effect.sheet.render(true);
            });
        });

        html.querySelectorAll('.delete-effect').forEach(async (element) => {
            element.addEventListener('click', async (event) => {
                let effect = await fromUuid(element.dataset.effectId);
                await this.actor.deleteEmbeddedDocuments('ActiveEffect', [effect.id]);
            });
        });
    }
}
