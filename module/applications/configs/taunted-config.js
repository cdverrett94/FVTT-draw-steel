import { CONDITIONS } from '../../constants/conditions.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class TauntedConfig extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);
        this.condition = options.condition;
        this.effect = options.effect;
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-gear',
            title: 'Configure Taunted',
        },
        tag: 'form',
        classes: ['mcdmrpg', 'sheet', 'taunted-config'],
        position: {
            width: 500,
            height: 'auto',
        },
        actions: {
            deleteChange: this.deleteChange,
            addTargets: this.addTargets,
        },
        form: {
            handler: this.onSubmitForm,
            submitOnChange: true,
            closeOnSubmit: false,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, TauntedConfig.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        list: {
            id: 'list',
            template: 'systems/mcdmrpg/templates/condition-configs/taunted.hbs',
        },
    };

    async _prepareContext(options) {
        const actors = {};
        for (const change of this.effect.changes) {
            const actor = await fromUuid(change.value);
            actors[change.value] = actor;
        }
        return {
            effect: this.effect,
            titles: this.effect.flags.mcdmrpg?.titles ?? [],
            headerLabel: CONDITIONS.taunted.name,
            actors,
        };
    }

    static async onSubmitForm(event, form, formData) {
        let updateData = {
            changes: [],
            flags: {
                mcdmrpg: {
                    titles: [],
                },
            },
        };
        const numberOfEntries = Object.keys(formData.object).length / 2;
        for (let index = 0; index < numberOfEntries; index++) {
            const title = formData.object[`title.${index}`];
            const value = formData.object[`actor.${index}`];

            updateData.changes[index] = {
                key: `system.taunted`,
                value: value,
                mode: 2,
            };

            updateData.flags.mcdmrpg.titles[index] = title;
        }
        await this.effect.update(updateData);
    }

    static async addTargets() {
        const targets = game.user.targets;
        let updateData = {
            changes: foundry.utils.duplicate(this.effect.changes),
            flags: {
                mcdmrpg: {
                    titles: foundry.utils.duplicate(this.effect.flags?.mcdmrpg?.titles ?? []),
                },
            },
        };

        for (const [key, token] of targets.entries()) {
            updateData.changes.push({
                key: 'system.taunted',
                value: token.actor.uuid,
                mode: 2,
            });

            updateData.flags.mcdmrpg.titles.push(token.actor.name);
        }

        await this.effect.update(updateData);
        await this.render({ parts: ['list'] });
        this.setPosition({ height: 'auto' });
    }

    static async deleteChange(event, target) {
        const { index } = target.dataset;

        let updateData = {
            changes: foundry.utils.duplicate(this.effect.changes),
            flags: {
                mcdmrpg: {
                    titles: foundry.utils.duplicate(this.effect.flags?.mcdmrpg?.titles),
                },
            },
        };

        updateData.changes.splice(index, 1);

        updateData.flags.mcdmrpg.titles.splice(index, 1);

        await this.effect.update(updateData);
        await this.render({ parts: ['list'] });
        this.setPosition({ height: 'auto' });
    }

    _onClose(options) {
        if (this.effect.changes.length === 0) {
            const actor = this.effect.parent;
            actor.deleteEmbeddedDocuments('ActiveEffect', [this.effect._id]);
        }
    }
}
