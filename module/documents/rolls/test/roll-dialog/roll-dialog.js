import { skills } from '../../../../constants.js';
import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { TestRoll } from '../test-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class TestRollDialog extends BaseRollDialog {
    constructor(options = {}) {
        super(options);
        this.context.baseFormula = '2d6';
        this.context.characteristic ??= skills[this.context.skill].default;
    }

    get sheetRoller() {
        return TestRoll;
    }

    static additionalOptions = {
        id: 'test-roll-dialog-{id}',
        classes: ['test-roll-dialog'],
        window: {
            title: 'Roll Test',
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, TestRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });
}
