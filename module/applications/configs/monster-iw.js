const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class MonsterIWSheet extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);

        this.actor = options.actor;
    }
    static additionalOptions = {
        classes: ['monster-iw'],
        position: {
            width: 500,
            height: 'auto',
        },
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
            handler: this.#formSubmit,
        },
        window: {
            title: 'Edit IW',
        },
        tag: 'form',
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, MonsterIWSheet.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            iw: {
                id: 'iw',
                template: 'systems/mcdmrpg/templates/documents/actor/monster/iw.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = {
            source: this.actor.toObject(),
            fields: this.actor.system.schema.fields,
        };

        return context;
    }

    static async #formSubmit(event, form, formData) {
        formData = foundry.utils.expandObject(formData.object);
        await this.actor.update(formData);
    }
}
