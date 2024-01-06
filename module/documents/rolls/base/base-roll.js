export class MCDMRoll extends Roll {
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        this.actor = options.actor;

        // Add this.boons, this.banes, this.boonBaneAdjustment
        Object.assign(
            this,
            this.constructor.getFinalBoonOrBane({
                boons: options.boons,
                banes: options.banes,
                impacts: options.impacts,
            })
        );
    }

    static getFinalBoonOrBane({ boons = 0, banes = 0, impacts = 0 }) {
        boons = Math.abs(Number(boons) || 0);
        banes = Math.abs(Number(banes) || 0);
        impacts = Math.abs(Number(impacts) || 0);
        let boonBaneAdjustment = boons - banes;
        return { boons, banes, boonBaneAdjustment, impacts };
    }
}
