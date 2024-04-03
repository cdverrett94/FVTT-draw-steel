import { capitalize } from '../../helpers.js';
import { PowerRoll } from '../power/power-roll.js';
import { PowerRollDialog } from '../power/roll-dialog.js';

export class TestPowerRollDialog extends PowerRollDialog {
    constructor(options = {}) {
        super(options);

        this.context = {};

        Object.assign(this.context, options);

        this.context.characteristic = this.context.characteristic ?? 'might';
        this.context.edges ??= 0;
        this.context.banes ??= 0;
        this.context.title = game.i18n.format('system.rolls.test.title', {
            skill: capitalize(this.context.skill),
            characteristic: game.i18n.localize(`system.characteristics.${this.context.characteristic}.label`),
        });
    }

    static additionalOptions = {
        actions: {
            roll: TestPowerRollDialog.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, TestPowerRollDialog.additionalOptions, { inplace: false });

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
        const context = super._prepareContext(options);

        return context;
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.setPosition({ height: 'auto' });
    }

    static async roll() {
        const rolls = [];
        const actorRollData = this.context.actor.getRollData();

        const roll = new PowerRoll(this.context.characteristic, actorRollData, { modifiers: [this.context] });
        console.log(roll.formula);
        await roll.evaluate();
        roll.options.tooltip = await roll.getTooltip();

        await ChatMessage.create({
            user: game.user.id,
            sound: CONFIG.sounds.dice,
            rolls: [roll],
            flags: {
                mcdmrpg: {
                    ability: this.context.skill,
                    roll,
                    actor: this.context.actor,
                    title: this.context.headerLabel,
                },
            },
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/test-roll.hbs', {
                title: this.context.title,
                isCritical: roll.isCritical,
                roll,
                ability: this.context.ability,
                actor: this.context.actor,
            }),
        });

        this.close();
    }
}
