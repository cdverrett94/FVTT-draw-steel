import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { TestRoll } from '../test-roll.js';

export class TestRollDialog extends BaseRollDialog {
    constructor(options) {
        super(options);
        console.log(options);
        if (this.context.proficient) this.context.boons += 1;
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
        return TestRoll;
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
