import { BaseRollDialog } from '../base/roll-dialog.js';
import { DamageRoll } from './damage-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class DamageRollDialog extends BaseRollDialog {
    constructor(options = {}) {
        super(options);
    }
    get rollType() {
        return 'damage';
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
        actions: {
            roll: DamageRollDialog.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, DamageRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.targets = await this.#addFormulaToTargets();

        return context;
    }

    async #addFormulaToTargets() {
        const targets = foundry.utils.duplicate(this.context.targets);
        const targetsAdjustments = {};

        for (const target in targets) {
            let token = await fromUuid(target);
            targetsAdjustments[target] = {
                ...targets[target],
                tokenActor: token.actor,
            };

            const targetRollContext = this.getTargetRollContext(targets[target]);
            const formula = this.sheetRoller.constructFinalFormula(this.context.baseFormula, targetRollContext);
            targetsAdjustments[target].formula = formula;
        }

        return targetsAdjustments;
    }

    getTargetRollContext(targetContext) {
        const targetRollContext = {
            ...this.globalContext,
            boons: this.context.boons + targetContext.boons,
            banes: this.context.banes + targetContext.banes,
            impacts: this.context.impacts + targetContext.impacts,
        };

        return targetRollContext;
    }

    static async roll(event, target) {
        const { tokenTarget, formula } = target.dataset;

        const targetContext = this.getTargetRollContext(this.context.targets[tokenTarget]);
        const roll = new this.sheetRoller(formula, this.actor, targetContext);
        await roll.evaluate();
        await roll.toMessage({
            headerLabel: this.globalContext.headerLabel,
            target: tokenTarget,
        });

        this.context.targets[tokenTarget].rolled = true;

        const allRolled = Object.entries(this.context.targets).every((current) => current[1].rolled === true);
        if (allRolled) this.close();
        else this.render({ parts: ['adjustments'] });
    }

    static async roll(event, target) {
        const { tokenTarget, formula } = target.dataset;
        const targetContext = this.getTargetRollContext(this.context.targets[tokenTarget]);
        const roll = new this.sheetRoller(formula, this.actor, targetContext);
        await roll.evaluate();
        await roll.toMessage({
            headerLabel: this.globalContext.headerLabel,
            target: tokenTarget,
        });
        this.context.targets[tokenTarget].rolled = true;
        const allRolled = Object.entries(this.context.targets).every((current) => current[1].rolled === true);
        if (allRolled) this.close();
        else this.render({ parts: ['adjustments'] });
    }
}
