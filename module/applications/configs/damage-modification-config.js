import { DAMAGE } from '../../constants/damage.js';
import { DamageButtonClick } from '../../hooks/renderChatMessage/add-target-buttons.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class DamageModification extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);

        Object.assign(this, options);
    }
    static additionalOptions = {
        classes: ['damage-modification'],
        position: {
            width: 300,
            height: 'auto',
        },
        form: {
            closeOnSubmit: true,
            submitOnChange: false,
            handler: this.#formSubmit,
        },
        window: {
            title: 'Modify Damage',
        },
        tag: 'form',
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, DamageModification.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            modifyDamage: {
                id: 'modify-damage',
                template: 'systems/draw-steel/templates/chat-messages/modify-damage-config.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = {
            amount: this.amount,
            type: this.type,
            constants: {
                damage: DAMAGE.TYPES,
            },
        };

        return context;
    }

    static async #formSubmit(event, form, formData) {
        formData = foundry.utils.expandObject(formData.object);

        let data = foundry.utils.deepClone(this.options);
        data.amount = Number(formData.amount);
        data.type = formData.type;

        DamageButtonClick(data);
    }
}
