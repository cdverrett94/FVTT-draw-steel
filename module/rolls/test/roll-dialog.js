import { capitalize } from '../../helpers.js';
import { PowerRollDialog } from '../power/roll-dialog.js';

export class TestPowerRollDialog extends PowerRollDialog {
    constructor(options = {}) {
        super(options);

        this.context.rollType = 'test';
    }

    get title() {
        let category;
        const foundCategory = Object.entries(this.context.actor.system.skills).find((category) => this.context.skill in category[1]);
        if (foundCategory) category = foundCategory[0];

        const foundSkill = this.context.actor.system.skills[category]?.[this.context.skill];

        let title = '';
        if (foundSkill) {
            const localizedSkill = foundSkill.isCustom ? foundSkill.label : game.i18n.localize(`system.skills.${category}.${this.context.skill}.label`);
            const localizedCharacteristic = game.i18n.localize(`system.characteristics.${this.context.characteristic}.label`);
            title = game.i18n.format('system.rolls.test.title', {
                skill: localizedSkill,
                characteristic: localizedCharacteristic,
            });
        } else {
            title = capitalize(skill);
        }
        return title;
    }

    static additionalOptions = {
        actions: {
            roll: this.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });

    static async roll() {
        const roll = this.context.baseRoll;
        await roll.evaluate();
        roll.options.tooltip = await roll.getTooltip();

        await ChatMessage.create({
            user: game.user.id,
            sound: CONFIG.sounds.dice,
            rolls: [roll],
            flags: {
                mcdmrpg: {
                    roll,
                    actor: this.context.actor,
                    title: this.context.headerLabel,
                },
            },
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/test-roll.hbs', {
                title: this.context.title,
                isCritical: roll.isCritical,
                roll,
                actor: this.context.actor,
            }),
        });

        this.close();
    }
}
