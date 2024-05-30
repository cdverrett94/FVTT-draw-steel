import { PowerRollDialog, ResistanceRoll } from '../_index.js';

export class ResistanceRollDialog extends PowerRollDialog {
    constructor(options = {}) {
        super(options);
    }

    get title() {
        return 'Resistance Roll';
    }

    static additionalOptions = {
        actions: {
            roll: this.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    async _prepareContext(options) {
        const rollData = {
            modifiers: [this.extractModifiers(this.context.general)],
            characteristic: this.context.characteristic,
        };
        const formulaParts = [];
        if (this.context.origin) {
            formulaParts.push({
                term: this.context.origin.system.characteristics[this.context.characteristic],
                flavor: `origin ${this.context.characteristic}`,
                sign: '-',
            });
        }
        this.context.baseRoll = new ResistanceRoll(ResistanceRoll.constructFinalFormula({ formulaParts, rollData }), this.context.actor.getRollData(), {
            rollOptions: this.context.general.rollOptions ?? [],
            ...rollData,
        });

        const context = super._prepareContext(options);

        return context;
    }

    static async roll() {
        const roll = this.context.baseRoll;
        await roll.roll();
        roll.options.tooltip = await roll.getTooltip();

        await ChatMessage.create({
            user: game.user.id,
            sound: CONFIG.sounds.dice,
            rolls: [roll],
            flags: {
                mcdmrpg: [], //chatSystemData,
            },
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/test-roll.hbs', {
                title: this.title,
                isCritical: roll.isCritical,
                roll,
                actor: this.context.actor,
            }),
        });

        this.close();
    }
}
