export class HeroSheet extends ActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'actor', 'hero'],
            template: `/systems/mcdmrpg/module/documents/actors/heroes/sheet/hero-sheet.html`,
            tabs: [
                /*{
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },*/
            ],
            scrollY: [
                /*'.equipment-list', '.skills-container'*/
            ],
            width: 1202,
            height: 768,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        let { abilities } = this.actor.system;
        const data = {
            name: this.actor.name,
            img: this.actor.img,
            ...this.actor.system,
        };

        for (const [group, abilities] of Object.entries(data.abilities)) {
            for (const [index, ability] of abilities.entries()) {
                let enrichContext = {
                    async: true,
                    actor: this.actor,
                    replaceCharacteristic: true,
                    applyKitDamage: true,
                };
                data.abilities[group][index].system.enrichedDamage = await TextEditor.enrichHTML(ability.system.damage, enrichContext);
                data.abilities[group][index].system.enrichedEffect = await TextEditor.enrichHTML(ability.system.effect, enrichContext);
            }
        }

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        // Roll Characteristic
        html.querySelectorAll('.characteristic .mcdmrpg-subheader').forEach((element) => {
            element.addEventListener('click', (event) => {
                let characteristic = element.closest('.characteristic').dataset.characteristic;
                this.actor.rollCharacteristic(characteristic);
            });
        });

        // Roll Skill
        html.querySelectorAll('.roll-skill').forEach((element) => {
            element.addEventListener('click', (event) => {
                let skill = element.dataset.skill;
                let subskill = element.dataset.subskill;
                this.actor.rollSkill({ skill, subskill });
            });
        });

        // Add Crafting & Knowledge Skills
        html.querySelectorAll('.add-skill').forEach((element) => {
            element.addEventListener('click', (event) => {
                let skill = element.dataset.skill;
                this.actor.addSkill({ skill, subskill: 'New ' + game.i18n.localize(`skills.${skill}.label`) + ' Skill' });
            });
        });

        // Delete Crafting & Knowledge Skills
        html.querySelectorAll('.delete-skill > i').forEach((element) => {
            element.addEventListener('click', (event) => {
                let skill = element.dataset.skill;
                let subskill = element.dataset.subskill;
                this.actor.deleteSkill({ skill, subskill });
            });
        });

        // Edit Ability Item
        html.querySelectorAll('.edit-ability').forEach((element) => {
            element.addEventListener('click', (event) => {
                let abilityId = element.dataset.abilityId;
                this.actor.items.find((item) => item.id === abilityId).sheet.render(true);
            });
        });

        // Delete Ability Item
        html.querySelectorAll('.delete-ability').forEach((element) => {
            element.addEventListener('click', (event) => {
                let abilityId = element.dataset.abilityId;
                this.actor.deleteEmbeddedDocuments('Item', [abilityId]);
            });
        });
    }

    /*async _onDropSkill(item) {
        const isDuplicateSkill = !!this.actor.items.find((i) => i.name == item.name && i.type === 'skill');
        if (isDuplicateSkill) return ui.notifications.error("You can't have multiple skills of the same name.");

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropClass(item) {
        const currentClass = this.actor.class;
        if (currentClass) await this.actor.deleteEmbeddedDocuments('Item', [currentClass.id]);

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropBackground(item) {
        const currentBackground = this.actor.background;
        if (currentBackground) await this.actor.deleteEmbeddedDocuments('Item', [currentBackground.id]);

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropTraining(item) {
        const currentTraining = this.actor.training;
        if (currentTraining) await this.actor.deleteEmbeddedDocuments('Item', [currentTraining.id]);

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropItem(event, data) {
        if (!this.actor.isOwner) return false;

        const item = await Item.implementation.fromDropData(data);

        await this._onDropItem2(item);
    }

    async _onDropItem2(item) {
        switch (item.type) {
            case 'skill':
                await this._onDropSkill(item);
                break;
            case 'class':
                await this._onDropClass(item);
                break;
            case 'background':
                await this._onDropBackground(item);
                break;
            case 'training':
                this._onDropTraining(item);
                break;
            default:
                await super._onDropItemCreate(item.toObject());
                break;
        }
    }

    async _onDropFolder(event, data) {
        if (!this.actor.isOwner) return [];
        if (data.documentName !== 'Item') return [];
        const folder = await Folder.implementation.fromDropData(data);
        if (!folder) return [];

        for (const item of folder.contents) {
            await this._onDropItem2(item);
        }
    }*/
}
