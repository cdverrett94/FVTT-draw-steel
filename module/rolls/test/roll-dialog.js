import { capitalize } from '../../helpers.js';
import { PowerRollDialog, TestRoll } from '../_index.js';

export class TestRollDialog extends PowerRollDialog {
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

    _prepareContext(options) {
        const rollData = {
            modifiers: [this.extractModifiers(this.context.general)],
            characteristic: this.context.characteristic,
        };
        this.context.baseRoll = new TestRoll(TestRoll.constructFinalFormula({ rollData }), this.context.actor.getRollData(), {
            rollOptions: this.context.general.rollOptions ?? [],
            ...rollData,
        });

        return super._prepareContext(options);
    }

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    static async roll() {
        const roll = this.context.baseRoll;
        await roll.roll();
        roll.options.tooltip = await roll.getTooltip();

        await ChatMessage.create({
            user: game.user.id,
            sound: CONFIG.sounds.dice,
            rolls: [roll],
            flags: {
                mcdmrpg: {
                    roll,
                    actor: this.context.actor,
                    title: this.title,
                },
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
