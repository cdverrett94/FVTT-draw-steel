import { characteristics } from '../../../../constants.js';
import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { ResistanceRoll } from '../resistance-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class ResistanceRollDialog extends BaseRollDialog {
    constructor(options = {}) {
        super(options);
        this.context.baseFormula = '2d6';
        this.context.rollType = 'resistance';
        this.context.headerLabel = game.i18n.format('mcdmrpg.rolls.resistance.dialog.headerLabel', {
            tn: this.context.tn ? `${this.context.tn} ` : '',
            characteristicAbbreviation: game.i18n.localize(characteristics[this.context.characteristic].abbreviation),
        });
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
