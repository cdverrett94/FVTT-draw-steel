import { skills } from '../../../../constants.js';
import { BaseRollDialogV2 } from '../../base/roll-dialog/roll-dialog.js';
import { ResistanceRoll } from '../resistance-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class ResistanceRollDialog extends BaseRollDialogV2 {
    constructor(options = {}) {
        super(options);
        this.context.baseFormula = '2d6';
        this.context.characteristic ??= skills[this.context.skill].default;
    }

    get sheetRoller() {
        return ResistanceRoll;
    }

    static additionalOptions = {
        id: 'resistance-roll-dialog-{id}',
        classes: ['resistance-roll-dialog'],
        window: {
            title: 'Roll Resitance',
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, ResistanceRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });
}
