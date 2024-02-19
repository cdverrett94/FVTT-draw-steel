import { characteristics } from '../../../../constants.js';
import { MCDMActorData } from '../../../actors/base/data-model.js';
import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { TestRoll } from '../test-roll.js';

export class TestRollDialog extends BaseRollDialog {
    constructor(options) {
        super(options);
    }

    get baseFormula() {
        return '2d6';
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'roll-dialog', 'test'],
            template: `/systems/mcdmrpg/module/documents/rolls/test/roll-dialog/sheet/roll-dialog-sheet.hbs`,
            height: 220,
            width: 315,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    get sheetRoller() {
        return TestRoll;
    }

    async getData() {
        this.context.replaceCharacteristic = true;
        let data = await super.getData();
        data.constructedFormula = this.formula;
        data.baseFormula = this.baseFormula;
        data.characteristics = characteristics;

        if (!data.characteristic) data.characteristic = MCDMActorData.defineSchema().skills.fields[data.skill].fields.characteristic.options.initial;

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        html.querySelector('#characteristic-select').addEventListener('change', (event) => {
            this.context.characteristic = event.target.value;
            this.render(true);
        });
    }
}
