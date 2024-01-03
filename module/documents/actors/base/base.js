import { abilityTypes, characteristics } from '../../../constants.js';

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

        this.system.grappleTN = 7 + this.system.might;
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

    async addSkill({ skill, subskill = 'New Skill', characteristic = 'reason', proficient = true } = {}) {
        if (skill !== 'craft' && skill !== 'knowledge') return ui.notifications.error('Skill must be "craft" or "knowledge".');
        if (!characteristics.includes(characteristic)) return ui.notifications.error('The used characteristic must be a valid one.');
        let skillArray = this.system.skills[skill];
        skillArray.push({
            subskill: subskill,
            characteristic: characteristic,
            proficient: proficient,
        });

        return await this.update({ [`system.skills.${skill}`]: skillArray });
    }

    async deleteSkill({ skill, subskill } = {}) {
        if (!skill || !subskill) return ui.notifications.error('Must provide a skill and subskill');
        if (skill !== 'craft' && skill !== 'knowledge') return ui.notifications.error('Skill must be "craft" or "knowledge".');
        let skillArray = this.system.skills[skill];
        let skillIndex = skillArray.findIndex((s) => s.subskill === subskill);
        if (skillIndex === -1) return ui.notifications.error(`No subskill ${subskill} found in ${skill}`);

        skillArray.splice(skillIndex, 1);
        return await this.update({ [`system.skills.${skill}`]: skillArray });
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
