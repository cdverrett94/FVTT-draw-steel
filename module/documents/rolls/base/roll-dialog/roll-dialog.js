import { characteristics } from '../../../../constants.js';

export class BaseRollDialog extends Application {
    constructor(options) {
        super(options);
        this.options.title = this.actor?.name ?? '';
        this.context.replaceCharacteristic = true;
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
        return this.options;
    }

    get actor() {
        return this.context.actor;
    }
    get baseFormula() {
        return this.context.baseFormula;
    }

    get formula() {
        let formula = this.sheetRoller.constructFinalFormula(this.baseFormula, this.context);
        return formula;
    }

    async getData() {
        this.context.actorId = this.actor?.uuid;

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
            let { type, adjustment } = element.dataset;

            element.addEventListener('click', (event) => {
                if (adjustment === 'add') this.context[type] += 1;
                else this.context[type] -= 1;

                this.context[type] = Math.max(this.context[type], 0);

                this.render(true);
            });
        });

        html.querySelectorAll('.roll-button')?.forEach((element) => {
            element.addEventListener('click', async (event) => {
                let roll = await new this.sheetRoller(this.formula, this.actor, this.context).evaluate();
                roll.toMessage();
                this.close();
            });
        });
    }
}

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class BaseRollDialogV2 extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);

        this.context = {};
        Object.assign(this.context, options);
        this.context.boons ??= 0;
        this.context.banes ??= 0;
        this.context.impacts ??= 0;
        this.context.baseFormula ??= 0;
        this.context.replaceCharacteristic ??= true;
    }

    get formula() {
        return this.sheetRoller.constructFinalFormula(this.context.baseFormula, this.context);
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-dice-d6',
        },
        classes: ['roll-dialog'],
        position: {
            width: 315,
        },
        actions: {
            adjustDice: BaseRollDialogV2.adjustDice,
            roll: BaseRollDialogV2.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseRollDialogV2.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        header: {
            id: 'header',
            template: 'systems/mcdmrpg/module/documents/rolls/base/roll-dialog/sheet/header.hbs',
        },
        characteristic: {
            id: 'characteristic-select',
            template: 'systems/mcdmrpg/module/documents/rolls/base/roll-dialog/sheet/characteristic-select.hbs',
        },
        adjustments: {
            id: 'dice-adjustments',
            template: 'systems/mcdmrpg/module/documents/rolls/base/roll-dialog/sheet/dice-adjustments.hbs',
        },
        roll: {
            id: 'roll',
            template: 'systems/mcdmrpg/module/documents/rolls/base/roll-dialog/sheet/roll-button.hbs',
        },
    };

    async _prepareContext(options) {
        return {
            characteristics,
            ...this.context,
            formula: this.formula,
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        if (partId === 'characteristic') {
            htmlElement.querySelector('select').addEventListener('change', (event) => {
                this.context.characteristic = event.target.value;
                this.render({ parts: ['header', 'roll'] });
            });
        }
    }

    static adjustDice(event, target) {
        let { type, adjustment } = { ...target.dataset };
        if (adjustment === 'increase') this.context[type] = Math.max(this.context[type] + 1, 0);
        else this.context[type] = Math.max(this.context[type] - 1, 0);

        this.render({ parts: ['adjustments', 'roll'] });
    }

    static async roll() {
        let roll = await new this.sheetRoller(this.formula, this.actor, this.context).evaluate();
        roll.toMessage();
        this.close();
    }
}
