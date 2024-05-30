import { PowerRoll } from '../_index.js';
import { PowerRollDialog } from '../power/roll-dialog.js';

export class AbilityRollDialog extends PowerRollDialog {
    constructor(options = {}) {
        options.characteristic ??= this.context.ability?.characteristic;
        super(options);

        this.context.hasTargets = Object.keys(this.context.targets).length ? true : false;
    }

    get title() {
        return this.context.ability?.name ?? 'Ability Roll';
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-dice-d6',
        },

        classes: ['roll-dialog'],
        actions: {
            roll: this.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, AbilityRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });

    async _prepareContext(options) {
        this._addRollToTargets();

        this.context.baseRoll = new PowerRoll(this.context.characteristic, this.context.actor.getRollData(), {
            ability: this.context.ability,
            rollOptions: this.context.general.rollOptions,
            modifiers: this.context.hasTargets ? [] : [this.getModifiers(this.context.general)],
            characteristic: this.context.characteristic,
        });
        const context = await super._prepareContext(options);

        return context;
    }

    static async roll() {
        const targets = this.context.targets;
        const rolls = [];

        const baseRoll = this.context.baseRoll;
        await baseRoll.roll();
        const chatSystemData = {
            origin: {
                actor: this.context.actor.uuid,
                item: this.context.ability.uuid,
            },
            context: {
                critical: baseRoll.isCritical,
            },
            targets: {},
        };

        baseRoll.options.tooltip = await baseRoll.getTooltip();

        for (const target in targets) {
            const targetRoll = targets[target].roll;
            targetRoll.terms[0] = baseRoll.terms[0];
            targetRoll.resetFormula();
            await targetRoll.roll();
            targetRoll.options.tooltip = await targetRoll.getTooltip();
            rolls.push(targetRoll);

            let targetTier;
            if (targetRoll.tier === 1) targetTier = 'one';
            else if (targetRoll.tier === 2) targetTier = 'two';
            else if (targetRoll.tier === 3) targetTier = 'three';
            else if (targetRoll.tier === 4) targetTier = 'four';

            chatSystemData.targets[`${targets[target].actor.id}`] = {
                uuid: targets[target].actor.uuid,
                token: targets[target].token.uuid,
                appliedEffects: foundry.utils.duplicate(this.context.ability.system.power.tiers[targetTier]).map((effect) => {
                    effect.applied = effect.type === 'damage' || effect.type === 'knockback' ? false : true;
                    return effect;
                }),
                tier: targetRoll.tier,
            };
        }

        await ChatMessage.create({
            type: 'ability',
            system: chatSystemData,
            user: game.user.id,
            sound: CONFIG.sounds.dice,
            rolls,
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/ability-message.hbs', {
                rolls,
                baseRoll,
                ability: this.context.ability,
                ...chatSystemData,
                actor: this.context.actor,
                isRoll: true,
            }),
        });

        this.close();
    }
}
