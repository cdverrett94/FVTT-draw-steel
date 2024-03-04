import { monsterRoles } from '../../../../constants.js';
import { BaseMCDMRPGActorSheet } from '../../base/sheet/sheet.js';

export class MonsterSheet extends BaseMCDMRPGActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'actor', 'monster'],
            template: `/systems/mcdmrpg/templates/documents/actors/monster/monster-sheet.hbs`,
            tabs: [
                /*{
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },*/
            ],
            // scrollY: ['.skill-list', '.tabbed-content'],
            width: 950,
            height: 900,
            resizable: true,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        let data = await super.getData();

        data.monsterRoles = monsterRoles;
        let proficientSkills = {};
        for (const [skill, data] of Object.entries(this.actor.system.skills)) {
            if (['craft', 'knowledge'].includes(skill)) {
                let specialSkills = data.filter((subskill) => subskill.proficient === true);
                if (specialSkills.length) proficientSkills[skill] = specialSkills;
            } else {
                if (data.proficient) proficientSkills[skill] = data;
            }
        }
        data.proficientSkills = proficientSkills;
        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];
    }
}
