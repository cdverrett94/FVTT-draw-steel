import { CHARACTERISTICS } from '../../constants/characteristics.js';
import { TIERS } from '../../constants/power-tier.js';

export class PowerRoll extends Roll {
    constructor(characteristic, data = {}, options = {}) {
        const modifiers = PowerRoll.combineModifiers(options.modifiers);
        let modifier;
        const difference = modifiers.edges - modifiers.banes;
        modifier = Math.abs(difference) === 1 ? Math.sign(modifiers.edges - modifiers.banes) * 2 : 0;
        let formula = '2d10';

        if (characteristic in CHARACTERISTICS) formula = `${formula} + @${characteristic}`;
        if (modifier) formula = `${formula} + ${modifier}`;
        if (modifiers.bonuses) formula = `${formula} + ${modifiers.bonuses}`;
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
        this.tierModified = ['doubleBane', 'doubleEdge'].includes(this.modifierType);
        this.characteristic = characteristic;
        this.ability = options.ability;
        this.actor = options.actor;
        this.modifiers = modifiers;
        this.modifier = modifier;

        this._formula = this.resetFormula();
    }

    static type = 'power';

    get isCritical() {
        return this.terms.find((term) => term.formula === '2d10')?.total > 2;
    }

    get formula() {
        return this.constructor.getFormula(this.terms);
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

    get tier() {
        const tierEntry = Object.entries(TIERS).find((entry) => this.total >= entry[1].start && this.total <= entry[1].end);
        let tier = Number(tierEntry[0]) ?? 1;

        if (this.modifierType === 'doubleBane') tier -= 1;
        else if (this.modifierType === 'doubleEdge') tier += 1;

        tier = Math.clamp(tier, 1, 3);

        return tier;
    }

    get abilityTierEffect() {
        if (!this.ability) return null;
        return this.ability.getTierEffect(this.tier);
    }
}
