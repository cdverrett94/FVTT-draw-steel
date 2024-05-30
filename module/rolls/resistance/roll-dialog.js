import { PowerRoll, PowerRollDialog } from '../_index.js';

export class ResistanceRollDialog extends PowerRollDialog {
    constructor(options = {}) {
        super(options);
    }

    get title() {
        return 'Resistance Roll';
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-dice-d6',
            title: 'Resistance Roll',
        },

        classes: ['resistance-roll'],
        position: {
            width: 400,
            height: 'auto',
        },
        actions: {
            roll: this.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, ResistanceRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });

    async _prepareContext(options) {
        this.context.baseRoll = new PowerRoll(this.context.characteristic, this.context.actor.getRollData(), {
            modifiers: [this.getModifiers(this.context.general)],
            rollOptions: this.context.general.rollOptions ?? [],
            ...this.context,
        });

        const context = super._prepareContext(options);

        return context;
    }

    static async roll() {
        const roll = this.context.baseRoll;
        await roll.evaluate();
        roll.options.tooltip = await roll.getTooltip();

        await ChatMessage.create({
            user: game.user.id,
            sound: CONFIG.sounds.dice,
            rolls: [roll],
            flags: {
                mcdmrpg: [], //chatSystemData,
            },
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/test-roll.hbs', {
                title: this.context.title,
                isCritical: roll.isCritical,
                roll,
            }),
        });

        this.close();
    }
}
