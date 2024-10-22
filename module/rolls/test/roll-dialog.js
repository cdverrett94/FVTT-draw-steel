import { PowerRollDialog, TestRoll } from '../_index.js';

export class TestRollDialog extends PowerRollDialog {
    constructor(options) {
        super(options);
        this.context.type = 'test';
    }
    get title() {
        const skillLabelPath = Handlebars.helpers.getSkillLabelPath(this.context.category, this.context.skill);
        const localizedSkill = game.i18n.localize(skillLabelPath);
        const localizedCharacteristic = game.i18n.localize(`system.characteristics.${this.context.characteristic}.label`);

        const title = game.i18n.format('system.rolls.test.title', {
            skill: localizedSkill,
            characteristic: localizedCharacteristic,
        });

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
                'draw-steel': {
                    roll,
                    actor: this.context.actor,
                    title: this.title,
                },
            },
            content: await renderTemplate('systems/draw-steel/templates/chat-messages/test-roll.hbs', {
                title: this.title,
                isCritical: roll.isCritical,
                roll,
                actor: this.context.actor,
            }),
        });

        this.close();
    }
}
