import { CHARACTERISTICS } from '../../constants/characteristics.js';
import { SKILLS } from '../../constants/skills.js';

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

        this.globalContext = {
            abilityName: this.context.abilityName,
            actor: this.context.actor,
            baseFormula: this.context.baseFormula,
            replaceCharacteristic: this.context.replaceCharacteristic,
            headerLabel: this.context.headerLabel,
            characteristic: this.context.characteristic,
        };

        this.globalContext.headerLabel = this.headerLabel;
        this.context.rollType = this.rollType;
    }

    get headerLabel() {
        const TNText = game.i18n.localize('system.rolls.tn.abbreviation');
        return game.i18n.format(`system.rolls.${this.rollType}.dialog.headerLabel`, {
            abilityName: this.globalContext.abilityName,
            characteristicAbbreviation: game.i18n.localize(CHARACTERISTICS[this.context.characteristic]?.abbreviation),
            tn: this.context.tn ? `${TNText} ${this.context.tn} ` : '',
            characteristic: this.context.characteristic ? `${game.i18n.localize(CHARACTERISTICS[this.context.characteristic]?.label)}-` : '',
            skill: game.i18n.localize(SKILLS[this.context.skill]?.label),
            subskill: ['knowledge', 'craft'].includes(this.context.skill) && this.context.subskill ? ` (${this.context.subskill})` : '',
        });
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-dice-d6',
        },
        classes: ['roll-dialog'],
        position: {
            width: 400,
            height: 'auto',
        },
        actions: {
            adjustDice: BaseRollDialog.adjustDice,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        header: {
            id: 'header',
            template: 'systems/mcdmrpg/templates/rolls/header.hbs',
        },
        characteristic: {
            id: 'characteristic-select',
            template: 'systems/mcdmrpg/templates/rolls/characteristic-select.hbs',
        },
        adjustments: {
            id: 'dice-adjustments',
            template: 'systems/mcdmrpg/templates/rolls/dice-adjustments.hbs',
        },
        roll: {
            id: 'roll',
            template: 'systems/mcdmrpg/templates/rolls/roll-button.hbs',
        },
    };

    async _prepareContext(options) {
        const context = {
            characteristics: CHARACTERISTICS,
            generalAdjustments: {
                boons: this.context.boons,
                banes: this.context.banes,
                impacts: this.context.impacts,
            },
            globalContext: {
                ...this.globalContext,
            },
            rollType: this.context.rollType,
        };

        return context;
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        if (partId === 'characteristic') {
            htmlElement.querySelector('select').addEventListener('change', (event) => {
                this.context.characteristic = event.target.value;
                this.globalContext.characteristic = event.target.value;
                this.context.headerLabel = this.headerLabel;
                this.globalContext.headerLabel = this.headerLabel;
                this.render({ parts: ['header', 'adjustments', 'roll'] });
                console.log(this.context);
            });
        }
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.setPosition({ height: 'auto' });
    }

    static adjustDice(event, target) {
        let { type, adjustment, tokenTarget } = { ...target.dataset };
        if (tokenTarget) {
            if (adjustment === 'increase') this.context.targets[tokenTarget][type] = Math.max(this.context.targets[tokenTarget][type] + 1, 0);
            else this.context.targets[tokenTarget][type] = Math.max(this.context.targets[tokenTarget][type] - 1, 0);
        } else {
            if (adjustment === 'increase') this.context[type] = Math.max(this.context[type] + 1, 0);
            else this.context[type] = Math.max(this.context[type] - 1, 0);
        }
        this.render({ parts: ['adjustments', 'roll'] });
    }
}
