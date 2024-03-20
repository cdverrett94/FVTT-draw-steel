import { CHARACTERISTICS } from '../../constants/characteristics.js';
import { SKILLS } from '../../constants/skills.js';
import { BaseRollDialog } from '../base/roll-dialog.js';
import { TestRoll } from './test-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class TestRollDialog extends BaseRollDialog {
    constructor(options = {}) {
        super(options);
        this.context.baseFormula = '2d6';
        this.context.characteristic ??= SKILLS[this.context.skill].default;
    }

    get headerLabel() {
        return game.i18n.format('system.rolls.test.dialog.headerLabel', {
            tn: this.context.tn ? `TN ${this.context.tn} ` : '',
            characteristic: this.context.characteristic ? `${game.i18n.localize(CHARACTERISTICS[this.context.characteristic].label)}-` : '',
            skill: game.i18n.localize(SKILLS[this.context.skill].label),
            subskill: ['knowledge', 'craft'].includes(this.context.skill) && this.context.subskill ? ` (${this.context.subskill})` : '',
        });
    }

    get sheetRoller() {
        return TestRoll;
    }

    get formula() {
        return new this.sheetRoller(this.context.baseFormula, this.context.actor.getRollData(), this.context).formula;
    }

    get rollType() {
        return 'test';
    }

    static additionalOptions = {
        id: 'test-roll-dialog-{id}',
        classes: ['test-roll-dialog'],
        window: {
            title: 'Roll Test',
        },
        actions: {
            roll: TestRollDialog.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, TestRollDialog.additionalOptions, { inplace: false });

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
