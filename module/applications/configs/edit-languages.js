import { LANGUAGES } from '../../constants/languages.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class EditLanguagesActorSheet extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);

        this.actor = options.actor;
    }
    static additionalOptions = {
        classes: ['edit-languages'],
        title: 'Edit languages',
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
            title: 'Edit Languages',
        },
        tag: 'form',
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, EditLanguagesActorSheet.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            languages: {
                id: 'languages',
                template: 'systems/draw-steel/templates/documents/actor/hero/languages.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        const context = {
            languages: LANGUAGES,
            source: this.actor.toObject(),
        };
        return context;
    }

    static async #formSubmit(event, form, formData) {
        await this.actor.update({ 'system.languages': formData.object['system.languages'] });
    }
}
