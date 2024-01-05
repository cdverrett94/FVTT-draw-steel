export class BaseRollDialog extends Application {
    constructor(options) {
        super(options);
        this.options.title = this.actor.name;
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'roll-dialog'],
            template: `/systems/mcdmrpg/module/documents/rolls/base/roll-dialog/sheet/roll-dialog-sheet.hbs`,
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

    async getData() {
        this.context.actorId = this.actor.uuid;

        let data = {
            ...this.context,
            formula: this.formula,
        };

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        html.querySelectorAll('.adjust-dice')?.forEach((element) => {
            let type = element.dataset.type;
            let adjustment = element.dataset.adjustment;
            element.addEventListener('click', (event) => {
                if (adjustment === 'add') this.options.context[type] += 1;
                else this.options.context[type] -= 1;

                this.options.context[type] = Math.max(this.options.context[type], 0);

                this.render(true);
            });
        });
    }
}
