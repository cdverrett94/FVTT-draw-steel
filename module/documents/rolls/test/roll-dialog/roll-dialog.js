import { characteristics, skills } from '../../../../constants.js';
import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { TestRoll } from '../test-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class TestRollDialog extends BaseRollDialog {
    constructor(options = {}) {
        super(options);
        this.context.baseFormula = '2d6';
        this.context.characteristic ??= skills[this.context.skill].default;
        this.context.rollType = 'test';
        this.context.headerLabel = game.i18n.format('mcdmrpg.rolls.test.dialog.headerLabel', {
            tn: this.context.tn ? `TN ${this.context.tn} ` : '',
            characteristic: this.context.characteristic ? `${game.i18n.localize(characteristics[this.context.characteristic].label)}-` : '',
            skill: game.i18n.localize(skills[this.context.skill].label),
            subskill: ['knowledge', 'craft'].includes(this.context.skill) && this.context.subskill ? ` (${this.context.subskill})` : '',
        });
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
