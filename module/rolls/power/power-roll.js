import { TIERS } from '../../constants/_index.js';

export class PowerRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        const modifiers = PowerRoll.combineModifiers(options.modifiers);
        let modifier;
        const difference = modifiers.edges - modifiers.banes;
        modifier = Math.abs(difference) === 1 ? Math.sign(modifiers.edges - modifiers.banes) * 2 : 0;

        super(formula, data, options);

        switch (difference) {
            case -2:
                this.modifierType = 'doubleBane';
                break;
            case -1:
                this.modifierType = 'bane';
                break;
            case 1:
                this.modifierType = 'edge';
                break;
            case 2:
                this.modifierType = 'doubleEdge';
                break;
            default:
                this.modifierType = 'none';
                break;
        }
        this.modifiedTier = ['doubleBane', 'doubleEdge'].includes(this.modifierType);
        this.characteristic = options.characteristic;
        this.ability = options.ability;
        this.actor = options.actor;
        this.modifiers = modifiers;
        this.modifier = modifier;
        this.options.rollOptions ??= [];
        this.options.rollOptions.push(`roll:modifier-type:${this.modifierType}`);
    }

    get rollOptions() {
        return this.options.rollOptions;
    }

    modifiedTier = false;
    tier = 0;

    async roll(options = {}) {
        //pre-roll modifications

        const roll = await this.evaluate(options);

        // post roll modifications

        roll.tier = roll.calculateTier();

        if (roll.tier !== 1 && roll.modifierType === 'doubleBane') {
            roll.rollOptions.push(`roll:tier:downgraded`);
            roll.modifiedTier = true;
        } else {
            roll.modifiedTier = false;
        }

        if (roll.tier !== 3 && roll.modifierType === 'doubleEdge') {
            roll.rollOptions.push(`roll:tier:upgraded`);
            roll.modifiedTier = true;
            this;
        } else {
            roll.modifiedTier = false;
        }

        if (roll.modifiedTier) roll.tier = roll.calculateTier();

        roll.rollOptions.push(
            `roll:total:${roll.total}`,
            `roll:dice:total:${this.terms.find((term) => term.formula === '2d10')?.total}`,
            `roll:tier:${roll.tier}`
        );
        if (roll.isCritical) roll.rollOptions.push(`roll:critical`);

        roll.rollOptions.sort();

        return roll;
    }

    static type = 'power';

    get isCritical() {
        return this.terms.find((term) => term.formula === '2d10')?.total === 20;
    }

    static CHAT_TEMPLATE = 'systems/mcdmrpg/templates/chat-messages/power-roll.hbs';

    static combineModifiers(sources) {
        const modifiers = {
            edges: 0,
            banes: 0,
            bonuses: 0,
        };
        if (!sources) return modifiers;

        sources.forEach((source) => {
            modifiers.edges += Number.isNumeric(source.edges) ? Number(source.edges) : 0;
            modifiers.banes += Number.isNumeric(source.banes) ? Number(source.banes) : 0;
            modifiers.bonuses += Number.isNumeric(source.bonuses) ? Number(source.bonuses) : 0;
        });

        return {
            edges: Math.clamp(modifiers.edges, 0, 2),
            banes: Math.clamp(modifiers.banes, 0, 2),
            bonuses: modifiers.bonuses,
        };
    }

    calculateTier() {
        const tierEntry = Object.entries(TIERS).find((entry) => this.total >= entry[1].start && this.total <= entry[1].end);
        let tier = Number(tierEntry[0]) ?? 1;

        if (this.modifiedTier && this.modifierType === 'doubleEdge') tier += 1;
        else if (this.modifiedTier && this.modifierType === 'doubleBane') tier -= 1;

        tier = Math.clamp(tier, 1, 3);

        return tier;
    }

    static constructFinalFormula({ formulaParts = [], rollData = {} } = {}) {
        let formula = '2d10';
        formulaParts = [{ term: '2d10' }, ...this.baseFormulaParts(rollData), ...formulaParts];

        for (const part of formulaParts) {
            part.sign ??= '+';
            part.term ??= 0;
            formula = `${formula} ${part.sign} ${part.term}`;
            if (part.flavor) formula = `${formula}[${part.flavor}]`;
        }

        return formula;
    }

    static baseFormulaParts(rollData) {
        const formulaParts = [];
        if (rollData.characteristic) {
            formulaParts.push({
                term: `@${rollData.characteristic}`,
                flavor: game.i18n.localize(`system.characteristics.${rollData.characteristic}.label`).toLowerCase(),
            });
        }

        const modifiers = PowerRoll.combineModifiers(rollData.modifiers);
        const difference = modifiers.edges - modifiers.banes;
        const modifier = Math.abs(difference) === 1 ? Math.sign(modifiers.edges - modifiers.banes) * 2 : 0;

        if (modifier) {
            formulaParts.push({
                term: modifier,
                flavor: game.i18n.localize(`system.dice.${modifier < 0 ? 'bane' : 'edge'}.singular`).toLowerCase(),
            });
        }

        if (modifiers.bonuses) {
            formulaParts.push({
                term: modifiers.bonuses,
                flavor: game.i18n.localize(`system.dice.${modifiers.bonuses < 0 ? 'penalty' : 'bonus'}.plural`).toLowerCase(),
            });
        }

        return formulaParts;
    }
}
