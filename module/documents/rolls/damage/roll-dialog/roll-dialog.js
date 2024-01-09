import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { DamageRoll } from '../../damage/damage-roll.js';

export class DamageRollDialog extends BaseRollDialog {
    constructor(options) {
        super(options);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'roll-dialog', 'damage'],
            template: `/systems/mcdmrpg/module/documents/rolls/damage/roll-dialog/sheet/roll-dialog-sheet.hbs`,
            height: 210,
            width: 315,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    get sheetRoller() {
        return DamageRoll;
    }

    async getData() {
        let data = await super.getData();
        this.context.applyExtraDamage ??= false;

        data.constructedFormula = this.formula;

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        let applyKitCheckbox = html.querySelector('.apply-kit-damage');
        applyKitCheckbox?.addEventListener('change', async (event) => {
            this.context.applyExtraDamage = applyKitCheckbox.checked;
            this.render(true);
        });
    }
}
