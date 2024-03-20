import { MONSTER_ROLES } from '../../constants/_index.js';
import { BaseActorSheet } from './base-actor.js';

export class MonsterSheet extends BaseActorSheet {
    static additionalOptions = {
        classes: ['monster'],
        position: {
            width: 950,
            height: 1100,
        },
        actions: {},
    };
    // overrides = {
    //     scrollY: ['.skill-list', '.tab'],
    //     resizable: true,
    // };

    // tabGroups = {
    //     main: null,
    // };
    // defaultTabs = {
    //     main: 'abilities',
    // };
    // _onRender(context, options) {
    //     console.log(
    //         this.actor.class.system.schema.fields.resources.element.fields.name.label,
    //         this.actor.class.system.schema.fields.resources.element.fields.max.label
    //     );
    //     for (const [group, tab] of Object.entries(this.tabGroups)) {
    //         if (tab === null) this.changeTab(this.defaultTabs[group], group, { force: true });
    //         else this.changeTab(tab, group, { force: true });
    //     }
    // }

    /** @inheritDoc */
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, this.additionalOptions, { inplace: false });

    /** @override */
    static PARTS = foundry.utils.mergeObject(
        super.PARTS,
        {
            header: {
                id: 'header',
                template: 'systems/mcdmrpg/templates/documents/monster/header.hbs',
            },
            characteristics: {
                id: 'characteristics',
                template: 'systems/mcdmrpg/templates/documents/partials/actor-characteristics.hbs',
            },
            skills: {
                id: 'skills',
                template: 'systems/mcdmrpg/templates/documents/monster/skills.hbs',
            },
            abilities: {
                id: 'abilities',
                template: 'systems/mcdmrpg/templates/documents/partials/actor-abilities-container.hbs',
            },
        },
        { inplace: false }
    );

    async _prepareContext(options) {
        let context = await super._prepareContext();

        context.monsterRoles = MONSTER_ROLES;
        let proficientSkills = {};
        for (const [skill, context] of Object.entries(this.actor.system.skills)) {
            if (['craft', 'knowledge'].includes(skill)) {
                let specialSkills = context.filter((subskill) => subskill.proficient === true);
                if (specialSkills.length) proficientSkills[skill] = specialSkills;
            } else {
                if (context.proficient) proficientSkills[skill] = context;
            }
        }
        context.proficientSkills = proficientSkills;
        return context;
    }

    static async #editEffect(event, target) {
        let effect = await fromUuid(element.dataset.effectId);
        effect.sheet.render(true);
    }

    static async #deleteEffect(event, target) {
        let effect = await fromUuid(element.dataset.effectId);
        await this.actor.deleteEmbeddedDocuments('ActiveEffect', [effect.id]);
    }
}
