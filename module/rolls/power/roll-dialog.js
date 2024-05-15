import { CHARACTERISTICS } from '../../constants/_index.js';
import { PowerRoll } from './power-roll.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class PowerRollDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);

        this.context = {};

        Object.assign(this.context, options);

        this.context.characteristic ??= 'might';
        this.context.general ??= {};
        this.context.general.edges ??= 0;
        this.context.general.banes ??= 0;
        this.context.general.bonuses ??= 0;

        this.context.title = this.title;
    }

    get title() {
        return 'Power Roll';
    }

    getModifiers(context) {
        return Object.fromEntries(Object.entries(context).filter((entry) => entry[0] === 'edges' || entry[0] === 'banes' || entry[0] === 'bonuses'));
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-dice-d6',
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
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, PowerRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        header: {
            id: 'header',
            template: 'systems/mcdmrpg/templates/rolls/power-roll/header.hbs',
        },
        characteristic: {
            id: 'characteristic-select',
            template: 'systems/mcdmrpg/templates/rolls/power-roll/characteristic-select.hbs',
        },
        adjustments: {
            id: 'dice-adjustments',
            template: 'systems/mcdmrpg/templates/rolls/power-roll/dice-adjustments.hbs',
        },
        roll: {
            id: 'roll',
            template: 'systems/mcdmrpg/templates/rolls/power-roll/roll-button.hbs',
        },
    };

    async _prepareContext(options) {
        this.#addRollToTargets();
        this.context.baseRoll = new PowerRoll(this.context.characteristic, this.context.actor.getRollData(), {
            modifiers: [this.getModifiers(this.context.general)],
        });

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
            htmlElement.querySelector('select').addEventListener('change', (event) => {
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

    #addRollToTargets() {
        for (const targetUuid in this.context.targets) {
            const actorRollData = this.context.actor.getRollData();
            const targetContext = this.context.targets[targetUuid];

            const contextRollData = this.getModifiers(this.context.general);
            const targetRollData = this.getModifiers(targetContext);
            const rollData = {
                target: targetContext.actor,
                token: targetContext.token,
                modifiers: [contextRollData, targetRollData],
                ability: this.context.ability,
            };
            this.context.targets[targetUuid].roll = new PowerRoll(this.context.characteristic, actorRollData, rollData);
        }
    }
}
