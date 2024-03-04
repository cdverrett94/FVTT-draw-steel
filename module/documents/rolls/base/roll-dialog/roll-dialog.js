import { characteristics } from '../../../../constants.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class BaseRollDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);

        this.context = {};
        Object.assign(this.context, options);
        this.context.boons ??= 0;
        this.context.banes ??= 0;
        this.context.impacts ??= 0;
        this.context.baseFormula ??= 0;
        this.context.replaceCharacteristic ??= true;
        this.context.title = '';
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
            adjustDice: BaseRollDialog.adjustDice,
            roll: BaseRollDialog.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseRollDialog.additionalOptions, { inplace: false });

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
        await roll.toMessage({
            headerLabel: this.context.headerLabel,
        });
        this.close();
    }
}
