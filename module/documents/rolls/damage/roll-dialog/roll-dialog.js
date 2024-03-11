import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { DamageRoll } from '../../damage/damage-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class DamageRollDialog extends BaseRollDialog {
    constructor(options = {}) {
        super(options);
        this.context.rollType = 'damage';
    }

    get headerLabel() {
        return game.i18n.format('system.rolls.damage.dialog.headerLabel', {
            abilityName: this.context.abilityName,
        });
    }

    get sheetRoller() {
        return DamageRoll;
    }

    static additionalOptions = {
        id: 'damage-roll-dialog-{id}',
        classes: ['damage-roll-dialog'],
        window: {
            title: 'Roll Damage',
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, DamageRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });
}
