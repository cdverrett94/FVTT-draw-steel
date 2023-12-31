import { abilityTypes } from '../../../constants.js';

export class MCDMActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    prepareBaseData() {
        super.prepareBaseData();

        for (const [characteristic, score] of Object.entries(this.system.characteristics)) {
            this.system[characteristic] = score;
        }

        this.system.hp.healing = Math.floor(this.system.hp.max / 3);
        this.system.hp.bloodied = Math.floor(this.system.hp.max / 2);
        let abilities = this.items.filter((item) => item.type === 'ability');

        this.system.abilities = {};
        abilityTypes.forEach((abilityType) => {
            this.system.abilities[`${abilityType}`] = abilities.filter((ability) => ability.system.type === abilityType);
        });

        this.system.highest = Math.max(...Object.values(this.system.characteristics));
        this.system.chanceHit = '@Damage[1d4 + @highest]';
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        this.system.hp.healing = Math.floor(this.system.hp.max / 3);
        this.system.hp.bloodied = Math.floor(this.system.hp.max / 2);

        if (this.system.hp.current <= this.system.hp.bloodied) {
            // TODO push bloodied condition
        }

        if (this.system.hp.current <= 0 && this.system.hp.current > this.system.hp.bloodied) {
            // TODO push unbalanced condition
        }

        if (this.system.hp.current === this.system.hp.bloodied) {
            // TODO mark dead
        }
    }

    async _preUpdate(changed, options, user) {
        if ('hp' in (changed.system || {})) {
            const currentHp = this.system.hp.current;
            const changedHp = changed.system.hp.current;
            const newHp = Math.clamp(changedHp, -this.system.hp.bloodied, this.system.hp.max);
            const hpDelta = newHp - currentHp;
            changed.system.hp.current = newHp;
            options.hpDelta = hpDelta;
        }

        await super._preUpdate(changed, options, user);
    }

    _onUpdate(data, options, userId) {
        super._onUpdate(data, options, userId);
        this._displayScrollingDamage(options.hpDelta);
    }

    _displayScrollingDamage(hpDelta) {
        if (!hpDelta) return;
        hpDelta = Number(hpDelta);
        const tokens = this.isToken ? [this.token?.object] : this.getActiveTokens(true);
        for (const t of tokens) {
            if (!t.visible || !t.renderable) continue;
            const pct = Math.clamped(Math.abs(hpDelta) / this.system.hp.max, 0, 1);
            canvas.interface.createScrollingText(t.center, hpDelta.signedString(), {
                anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
                fontSize: 16 + 32 * pct, // Range between [16, 48]
                fill: hpDelta < 0 ? 'red' : 'green',
                stroke: 0x000000,
                strokeThickness: 4,
                jitter: 0.25,
            });
        }
    }
}
