import { characteristics } from '../../../constants.js';
import { MCDMActor } from '../base/base.js';

export class HeroActor extends MCDMActor {
    prepareBaseData() {
        super.prepareBaseData();

        this.system.class = this.items.find((item) => item.type === 'class');
        this.system.kit = this.items.find((item) => item.type === 'kit');

        this.system.resources = {};
        this.system.currentResources.forEach((currentResource) => {
            let max;
            let classResource = this.system.class.system.resources.find((resource) => resource.name === currentResource.name);

            max = Number(classResource?.max ?? 0);
            if (max) {
                max = Roll.create(max, this.getRollData())._evaluateSync().total;
            }

            this.system.resources[currentResource.name] = {
                current: currentResource.current,
                max,
            };
        });

        this.system.grappleTN = 7 + this.system.might;
        this.system.reach = 1;
        this.system.speed = 6;
    }

    async rollCharacteristic(characteristic) {
        let modififer = this.system.characteristics[characteristic];
        let roll = await Roll.create(`2d6 + ${modififer}`).evaluate({ async: true });
        roll.toMessage({
            flavor: `${characteristic} Roll`,
        });
    }

    async rollSkill({ skill, subskill, characteristic } = {}) {
        if (!skill) return ui.notifications.error('A skill must be provided to roll.');
        if (characteristic && !characteristics.includes(characteristic)) return ui.notifications.error('The used characteristic must be a valid one.');

        let proficient;
        if (skill === 'craft' || skill === 'knowledge') {
            if (!subskill) return ui.notifications.error(`A subskill must be provided to roll ${skill}.`);

            let sub = this.system.skills[skill].find((s) => s.subskill === subskill);
            if (!sub) return ui.notifications.error(`There is no ${skill} subskill for ${subskill}.`);

            proficient = sub.proficient;
            characteristic = characteristic ?? sub.characteristic;
        } else {
            proficient = this.system.skills[skill].proficient;
            characteristic = characteristic ?? this.system.skills[skill].characteristic;
        }
        let characteristicModifier = this.system.characteristics[characteristic];

        let roll = await Roll.create(`2d6 + ${characteristicModifier}${proficient ? '+ 1d4' : ''}`).evaluate({ async: true });
        roll.toMessage({
            flavor: `${game.i18n.localize('characteristics.' + characteristic + '.label')}-${game.i18n.localize('skills.' + skill + '.label')}${
                subskill ? ' (' + subskill + ')' : ''
            } Roll`,
        });
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

        await this.update({ [`system.skills.${skill}`]: skillArray });
    }

    async deleteSkill({ skill, subskill } = {}) {
        if (!skill || !subskill) return ui.notifications.error('Must provide a skill and subskill');
        if (skill !== 'craft' && skill !== 'knowledge') return ui.notifications.error('Skill must be "craft" or "knowledge".');
        let skillArray = this.system.skills[skill];
        let skillIndex = skillArray.findIndex((s) => s.subskill === subskill);
        if (skillIndex === -1) return ui.notifications.error(`No subskill ${subskill} found in ${skill}`);

        skillArray.splice(skillIndex, 1);
        await this.update({ [`system.skills.${skill}`]: skillArray });
    }
}
