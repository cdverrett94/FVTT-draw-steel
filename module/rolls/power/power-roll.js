import { CHARACTERISTICS } from '../../constants/characteristics.js';

export class PowerRoll extends Roll {
    constructor(characteristic, data = {}, options = {}) {
        const modifiers = PowerRoll.combineModifiers(options.modifiers);
        const modifier = modifiers.edges - modifiers.banes;
        let formula = '2d6';
        if (characteristic in CHARACTERISTICS) formula = `${formula} + @${characteristic}`;
        if (modifier !== 0) formula = `${formula} + ${modifier}`;

        super(formula, data, options);

        this.characteristic = characteristic;
        this.ability = options.ability;
        this.actor = options.actor;
        this.modifiers = modifiers;
        this.modifier = modifier;

        this._formula = this.resetFormula();
    }
    static type = 'power';

    get isCritical() {
        return this.terms.find((term) => term.formula === '2d6')?.total === 12;
    }

    get formula() {
        return this.constructor.getFormula(this.terms);
    }

    static CHAT_TEMPLATE = 'systems/mcdmrpg/templates/chat-messages/power-roll.hbs';

    static combineModifiers(sources) {
        const modifiers = {
            edges: 0,
            banes: 0,
        };
        if (!sources) return modifiers;

        sources.forEach((source) => {
            modifiers.edges += Number.isNumeric(source.edges) ? Number(source.edges) : 0;
            modifiers.banes += Number.isNumeric(source.banes) ? Number(source.banes) : 0;
        });

        return {
            edges: Math.clamp(modifiers.edges, 0, 2),
            banes: Math.clamp(modifiers.banes, 0, 2),
        };
    }

    get tier() {
        return this.ability?.getTier(this.total);
    }
}
