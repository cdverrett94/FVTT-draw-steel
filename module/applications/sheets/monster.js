import { MONSTER_ROLES } from '../../constants/monster-roles.js';
import { BaseActorSheet } from './base-actor.js';

export class MonsterSheet extends BaseActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'actor', 'monster'],
            template: `/systems/mcdmrpg/templates/documents/monster/monster-sheet.hbs`,
            width: 950,
            height: 900,
            resizable: true,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        let data = await super.getData();

        data.monsterRoles = MONSTER_ROLES;
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
}
