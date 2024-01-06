import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { ResistanceRoll } from '../resistance-roll.js';

export class ResistanceRollDialog extends BaseRollDialog {
    constructor(options) {
        super(options);
    }

    get baseFormula() {
        return '2d6';
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'roll-dialog', 'resistance'],
            template: `/systems/mcdmrpg/module/documents/rolls/resistance/roll-dialog/sheet/roll-dialog-sheet.hbs`,
            height: 210,
            width: 315,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    get sheetRoller() {
        return ResistanceRoll;
    }

    async getData() {
        let data = await super.getData();
        data.constructedFormula = this.formula;
        this.context.replaceCharacteristic = true;

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];
    }
}
