import { CONDITIONS } from '../../constants/conditions.js';
import { DAMAGE } from '../../constants/damage.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export class OngoingDamageConfig extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options = {}) {
        super(options);
        this.condition = options.condition;
        this.effect = options.effect;
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-gear',
            title: 'Configure Ongoing Damage',
        },
        tag: 'form',
        classes: ['mcdmrpg', 'sheet', 'ongoing-damage-config', 'system'],
        position: {
            width: 500,
            height: 'auto',
        },
        actions: {
            addChange: this.addChange,
            deleteChange: this.deleteChange,
        },
        form: {
            handler: this.onSubmitForm,
            submitOnChange: true,
            closeOnSubmit: false,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, OngoingDamageConfig.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = {
        list: {
            id: 'list',
            template: 'systems/mcdmrpg/templates/condition-configs/ongoing-damage.hbs',
        },
    };

    async _prepareContext(options) {
        return {
            condition: this.condition,
            effect: this.effect,
            titles: this.effect.flags?.mcdmrpg?.titles,
            damage: DAMAGE.TYPES,
            currentSelections: this.effect.changes.map((change) => change.key.split('system.ongoingDamage.')[1]),
            headerLabel: CONDITIONS.ongoingdamage.name,
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
        const numberOfEntries = Object.keys(formData.object).length / 3;
        for (let index = 0; index < numberOfEntries; index++) {
            const title = formData.object[`title.${index}`];
            const damage = formData.object[`damage.${index}`];
            const value = formData.object[`value.${index}`];

            updateData.changes[index] = {
                key: `system.ongoingDamage.${damage}`,
                value: Number(value),
                mode: 2,
            };

            updateData.flags.mcdmrpg.titles[index] = title;
        }
        await this.effect.update(updateData);
    }

    static async addChange() {
        let updateData = {
            changes: foundry.utils.duplicate(this.effect.changes),
            flags: {
                mcdmrpg: {
                    titles: foundry.utils.duplicate(this.effect.flags?.mcdmrpg?.titles),
                },
            },
        };

        updateData.changes.push({
            key: 'system.ongoingDamage.untyped',
            value: 0,
            mode: 2,
        });

        updateData.flags.mcdmrpg.titles.push('New Ongoing Damage');

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
