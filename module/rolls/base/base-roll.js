export class MCDMRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        this.actor = options.actor;
        // Add this.boons, this.banes, this.boonBaneAdjustment
        Object.assign(
            this.options,
            this.constructor.getFinalBoonOrBane({
                boons: options.boons,
                banes: options.banes,
                impacts: options.impacts,
            })
        );
    }

    get formula() {
        let formula = this.constructor.constructFinalFormula(this.options.baseFormula, this.options);
        return formula;
    }

    static getFinalBoonOrBane({ boons = 0, banes = 0, impacts = 0 }) {
        boons = Math.abs(Number(boons) || 0);
        banes = Math.abs(Number(banes) || 0);
        impacts = Math.abs(Number(impacts) || 0);
        const appliedBoons = boons - banes;
        return { boons, banes, appliedBoons, impacts };
    }

    static constructFinalFormula(baseFormula, options) {
        let { appliedBoons, impacts } = this.getFinalBoonOrBane({ boons: options.boons, banes: options.banes, impacts: options.impacts });
        let constructedFormula = baseFormula === '0' ? '' : baseFormula;

        // Apply Boons and Banes to final roll
        let boonBaneAdjustmentSign = appliedBoons > 0 ? '+' : '-';
        if (appliedBoons != 0) constructedFormula = `${constructedFormula} ${boonBaneAdjustmentSign} ${Math.abs(appliedBoons)}d4`;
        if (impacts) constructedFormula = `${constructedFormula} + ${impacts}d8`;

        // Get characteristic for final roll
        let characteristic = options.actor.system.characteristics[options.characteristic] ?? 0;

        // If DamageRoll, get bonus damage from hero kit or monster data
        let bonusDamage = 0;
        if (this.constructor.name === 'DamageRoll') {
            if (options.actor?.type === 'hero' && options.actor?.system.kit?.system.damage && options.applyExtraDamage) {
                bonusDamage = options.actor.system.kit?.system.damage;
            } else if (options.actor?.type === 'monster' && options.actor?.system.bonusDamage && options.applyExtraDamage) {
                bonusDamage = options.actor.system.bonusDamage;
            }
        }

        // Apply the non-rolled numbers to the final roll
        let staticDamage = characteristic + bonusDamage;
        if (staticDamage) constructedFormula = `${constructedFormula} + ${staticDamage}`;

        // Remove leading plus in the event the base formula wasn't present
        constructedFormula = constructedFormula.replace(/^ ?[\+] /gm, '');

        return constructedFormula;
    }
}
