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
            template: `/systems/mcdmrpg/module/documents/actors/monster/sheet/monster-sheet.hbs`,
            tabs: [
                /*{
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },*/
            ],
            // scrollY: ['.skill-list', '.tabbed-content'],
            width: 700,
            height: 'auto',
            resizable: true,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        let data = await super.getData();

        data.monsterRoles = monsterRoles;

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];
    }
}
