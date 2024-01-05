import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';

export class ResistanceRollDialog extends BaseRollDialog {
    constructor(options) {
        super(options);
        this.options.title = this.actor.name;
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'roll-dialog', 'resistance'],
            template: `/systems/mcdmrpg/module/documents/rolls/resistance/roll-dialog/sheet/roll-dialog-sheet.hbs`,
            height: 210,
            width: 315,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    get context() {
        return this.options.context;
    }

    get actor() {
        return this.context.actor;
    }
    get formula() {
        return this.context.baseFormula;
    }

    damageFormula() {
        let formula = ResistanceRoll.constructFinalFormula(this.formula, this.context);
        let damageRoll = new ResistanceRoll(formula, {}, this.context);

        return damageRoll._formula;
    }

    async getData() {
        let data = await super.getData();
        this.context.applyKitDamage ??= false;
        this.context.actorId = this.actor.uuid;

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        html.querySelectorAll('.roll-button')?.forEach((element) => {
            element.addEventListener('click', async (event) => {
                let roll = await new DamageRoll(DamageRoll.constructFinalFormula(this.formula, this.context), {}, this.context).evaluate();
                roll.toMessage();
                this.close();
            });
        });

        let applyKitCheckbox = html.querySelector('.apply-kit-damage');
        applyKitCheckbox?.addEventListener('change', async (event) => {
            this.context.applyKitDamage = applyKitCheckbox.checked;
            this.render(true);
        });
    }
}
