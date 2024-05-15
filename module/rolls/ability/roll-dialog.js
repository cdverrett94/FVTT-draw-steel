import { PowerRoll } from '../power/power-roll.js';
import { PowerRollDialog } from '../power/roll-dialog.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
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
            roll: AbilityPowerRollDialog.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, AbilityPowerRollDialog.additionalOptions, { inplace: false });

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
        const context = await super._prepareContext(options);

        return context;
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        if (partId === 'characteristic') {
            htmlElement.querySelector('select').addEventListener('change', (event) => {
                this.context.characteristic = event.target.value;
                this.context.title = this.title;
                this.render({ parts: ['header', 'adjustments', 'roll'] });
            });
        }
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.setPosition({ height: 'auto' });
    }

    static adjustDice(event, target) {
        let { type, adjustment, tokenTarget } = { ...target.dataset };
        let object = tokenTarget ? this.context.targets[tokenTarget] : this.context;

        if (adjustment === 'increase') object[type] = Math.max(object[type] + 1, 0);
        else object[type] = Math.max(object[type] - 1, 0);

        this.render({ parts: ['adjustments', 'roll'] });
    }

    static async roll() {
        const targets = this.context.targets;
        const rolls = [];
        const actorRollData = this.context.actor.getRollData();
        const baseRoll = this.context.hasTargets
            ? new PowerRoll(this.context.characteristic, actorRollData, { ability: this.context.ability })
            : this.context.baseRoll;
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
            flags: {
                mcdmrpg: {
                    ability: this.context.ability,
                    baseRoll,
                    actor: this.context.actor,
                    title: this.context.title,
                },
            },
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
