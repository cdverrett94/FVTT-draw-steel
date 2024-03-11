import { BaseMCDMRPGActorSheet } from '../../base/sheet/sheet.js';

export class HeroSheet extends BaseMCDMRPGActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'actor', 'hero'],
            template: `/systems/mcdmrpg/templates/documents/actors/hero/hero-sheet.hbs`,
            tabs: [
                {
                    navSelector: '.sheet-tabs',
                    contentSelector: '.tabbed-content',
                    initial: 'abilities',
                },
            ],
            scrollY: ['.skill-list', '.tab'],
            width: 1200, //1182
            height: 1100, //1111
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
                this.actor.addSkill({ skill, subskill: 'New ' + game.i18n.localize(`system.skills.${skill}.label`) + ' Skill' });
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
