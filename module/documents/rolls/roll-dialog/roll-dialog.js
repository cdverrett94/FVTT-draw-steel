import { DamageRoll } from '../damage-roll.js';

export class MCDMRollDialog extends Application {
    constructor(options) {
        super(options);
        this.options.title = this.actor.name;
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'roll-dialog'],
            template: `/systems/mcdmrpg/module/documents/rolls/roll-dialog/sheet/roll-dialog-sheet.hbs`,
            resizable: true,
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
        return new DamageRoll(DamageRoll.constructFinalFormula(this.formula, this.context))._formula;
    }

    async getData() {
        this.context.applyKitDamage ??= false;
        let data = {
            ...this.context,
            constructedFormula: this.damageFormula(),
        };

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        html.querySelectorAll('.adjust-d4')?.forEach((element) => {
            let type = element.dataset.type;
            let adjustment = element.dataset.adjustment;
            element.addEventListener('click', (event) => {
                if (adjustment === 'add') this.options.context[type] += 1;
                else this.options.context[type] -= 1;

                this.options.context[type] = Math.max(this.options.context[type], 0);

                this.render(true);
            });
        });

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
