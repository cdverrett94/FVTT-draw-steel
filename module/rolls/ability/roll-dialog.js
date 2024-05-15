import { PowerRoll } from '../power/power-roll.js';
import { PowerRollDialog } from '../power/roll-dialog.js';

export class AbilityPowerRollDialog extends PowerRollDialog {
    constructor(options = {}) {
        super(options);

        this.context.characteristic = this.context.ability?.characteristic ?? 'might';
        this.context.hasTargets = Object.keys(this.context.targets).length ? true : false;
    }

    get title() {
        return this.context.ability?.name ?? super.title;
    }

    static additionalOptions = {
        window: {
            icon: 'fa-solid fa-dice-d6',
            title: 'Power Roll',
        },

        classes: ['roll-dialog'],
        position: {
            width: 400,
            height: 'auto',
        },
        actions: {
            roll: this.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, AbilityPowerRollDialog.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(super.PARTS, {}, { inplace: false });

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        if (this.context.hasTargets) {
            this.context.baseRoll = new PowerRoll(this.context.characteristic, this.context.actor.getRollData(), { ability: this.context.ability });
        } else {
            this.context.baseRoll = new PowerRoll(this.context.characteristic, this.context.actor.getRollData(), {
                ability: this.context.ability,
                modifiers: [this.getModifiers(this.context.general)],
            });
        }
        context.context.baseRoll = this.context.baseRoll;

        return context;
    }

    static async roll() {
        const targets = this.context.targets;
        const rolls = [];

        const baseRoll = this.context.baseRoll;
        await baseRoll.evaluate();
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
            if (!targetRoll._evaluated) await targetRoll.evaluate();
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
            content: await renderTemplate('systems/mcdmrpg/templates/chat-messages/ability-roll.hbs', {
                rolls,
                baseRoll,
                ability: this.context.ability,
                ...chatSystemData,
                actor: this.context.actor,
            }),
        });

        this.close();
    }
}
