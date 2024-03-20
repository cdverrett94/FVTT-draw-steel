import { BaseRollDialog } from '../base/roll-dialog.js';
import { ResistanceRoll } from './resistance-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class ResistanceRollDialog extends BaseRollDialog {
    constructor(options = {}) {
        super(options);
        this.context.baseFormula = '2d6';
    }

    get sheetRoller() {
        return ResistanceRoll;
    }
    get formula() {
        return new this.sheetRoller(this.context.baseFormula, this.context.actor.getRollData(), this.context).formula;
    }
    get rollType() {
        return 'resistance';
    }

    static additionalOptions = {
        id: 'resistance-roll-dialog-{id}',
        classes: ['resistance-roll-dialog'],
        window: {
            title: 'Roll Resitance',
        },
        actions: {
            roll: ResistanceRollDialog.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, ResistanceRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.formula = this.formula;

        return context;
    }

    static async roll(event, target) {
        const roll = new this.sheetRoller(this.formula, this.actor, this.context);
        await roll.evaluate();
        await roll.toMessage({
            headerLabel: this.globalContext.headerLabel,
        });
        this.close();
    }
}
