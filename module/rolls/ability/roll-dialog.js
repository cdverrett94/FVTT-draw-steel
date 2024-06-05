import { TIER_TEXT } from '../../constants/power-tier.js';
import { AbilityRoll, PowerRollDialog } from '../_index.js';

export class AbilityRollDialog extends PowerRollDialog {
    constructor(options = {}) {
        options.characteristic ??= this.context.ability?.characteristic;
        super(options);

        this.context.hasTargets = Object.keys(this.context.targets).length ? true : false;
        this.context.type = 'ability';
    }

    get title() {
        const abilityLabel = this.context.ability?.name ?? game.i18n.localize('system.items.ability.label.singular');
        return `${abilityLabel} ${game.i18n.localize('system.items.ability.FIELDS.power.label')}`;
    }

    static additionalOptions = {
        actions: {
            roll: this.roll,
        },
    };

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    async _prepareContext(options) {
        this.#addRollToTargets();

        const rollData = {
            modifiers: this.context.hasTargets ? [] : [this.extractModifiers(this.context.general)],
            characteristic: this.context.characteristic,
        };

        this.context.baseRoll = new AbilityRoll(AbilityRoll.constructFinalFormula({ rollData }), this.context.actor.getRollData(), {
            ability: this.context.ability,
            rollOptions: this.context.general.rollOptions,
            ...rollData,
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
            const roll = targets[target].roll;
            roll.terms[0] = baseRoll.terms[0];
            roll.resetFormula();
            await roll.roll();

            rolls.push(roll);

            chatSystemData.targets[`${targets[target].actor.id}`] = {
                uuid: targets[target].actor.uuid,
                token: targets[target].token.uuid,
                appliedEffects: foundry.utils.duplicate(this.context.ability.system.power.tiers[TIER_TEXT[roll.tier]]).map((effect) => {
                    effect.applied = effect.type === 'damage' || effect.type === 'knockback' ? false : true;
                    return effect;
                }),
                tier: roll.tier,
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

    #addRollToTargets() {
        for (const targetUuid in this.context.targets) {
            const actorRollData = this.context.actor.getRollData();
            const targetContext = this.context.targets[targetUuid];

            const contextRollData = this.extractModifiers(this.context.general);
            const targetRollData = this.extractModifiers(targetContext);
            const rollData = {
                target: targetContext.actor,
                token: targetContext.token,
                modifiers: [contextRollData, targetRollData],
                ability: this.context.ability,
                rollOptions: [...this.context.general.rollOptions, ...this.context.targets[targetUuid].rollOptions].sort(),
                characteristic: this.context.characteristic,
            };

            this.context.targets[targetUuid].roll = new AbilityRoll(AbilityRoll.constructFinalFormula({ rollData }), actorRollData, rollData);
        }
    }
}
