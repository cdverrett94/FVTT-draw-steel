import { CHARACTERISTICS } from '../../constants/_index.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class PowerRollDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);

        this.context = {};
        Object.assign(this.context, options);

        this.context.characteristics ??= ['might'];
        this.context.general ??= {};
        this.context.general.edges ??= 0;
        this.context.general.banes ??= 0;
        this.context.general.bonuses ??= 0;
        this.context.title = this.title;
        this.context.type = 'power';
    }

    get title() {
        return 'Power Roll';
    }

    extractModifiers(context) {
        return Object.fromEntries(Object.entries(context).filter((entry) => entry[0] === 'edges' || entry[0] === 'banes' || entry[0] === 'bonuses'));
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-dice-d10',
            title: 'Power Roll',
        },

        classes: ['roll-dialog'],
        position: {
            width: 400,
            height: 'auto',
        },
        actions: {
            adjustDice: this.adjustDice,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        header: {
            id: 'header',
            template: 'systems/draw-steel/templates/rolls/power-roll/header.hbs',
        },
        characteristic: {
            id: 'characteristic-select',
            template: 'systems/draw-steel/templates/rolls/power-roll/characteristic-select.hbs',
        },
        adjustments: {
            id: 'dice-adjustments',
            template: 'systems/draw-steel/templates/rolls/power-roll/dice-adjustments.hbs',
        },
        roll: {
            id: 'roll',
            template: 'systems/draw-steel/templates/rolls/power-roll/roll-button.hbs',
        },
    };

    async _prepareContext(options) {
        const context = {
            characteristics: CHARACTERISTICS,
            context: {
                ...this.context,
            },
        };

        return context;
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        if (partId === 'characteristic') {
            htmlElement.querySelector('select')?.addEventListener('change', (event) => {
                this.context.characteristic = event.target.value;
                this.context.title = this.title;
                this.render({ parts: ['header', 'adjustments'] });
            });
        }
    }

    static adjustDice(event, target) {
        let { type, adjustment, tokenTarget } = { ...target.dataset };
        let object = tokenTarget ? this.context.targets[tokenTarget] : this.context.general;

        if (adjustment === 'increase') object[type] += 1;
        else object[type] -= 1;

        if (type !== 'bonuses') object[type] = Math.max(object[type], 0);

        this.render({ parts: ['adjustments'] });
    }
}
