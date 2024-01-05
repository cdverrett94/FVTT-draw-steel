import { BaseRollDialog } from '../../base/roll-dialog/roll-dialog.js';
import { DamageRoll } from '../../damage/damage-roll.js';

export class DamageRollDialog extends BaseRollDialog {
    constructor(options) {
        super(options);
        this.options.title = this.actor.name;
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'roll-dialog', 'damage'],
            template: `/systems/mcdmrpg/module/documents/rolls/damage/roll-dialog/sheet/roll-dialog-sheet.hbs`,
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
    get baseFormula() {
        return this.context.baseFormula;
    }

    get formula() {
        let damageRoll = new DamageRoll(this.baseFormula, this.actor.system, this.context);

        return damageRoll._formula;
    }

    async getData() {
        let data = await super.getData();
        this.context.applyKitDamage ??= false;
        this.context.actorId = this.actor.uuid;

        data.constructedFormula = this.formula;

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        html.querySelectorAll('.roll-button')?.forEach((element) => {
            element.addEventListener('click', async (event) => {
                let roll = await new DamageRoll(this.formula, {}, this.context).evaluate();
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
