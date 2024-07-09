import { ABILITIES, CHARACTERISTICS, CONDITIONS, DAMAGE } from '../../constants/_index.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
export class BaseActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    mode = 'view';

    tabGroups = {
        main: this.actor.type === 'hero' ? 'details' : 'abilities',
    };

    static additionalOptions = {
        window: {
            icon: 'fas fa-user',
            positioned: true,
            resizable: true,
        },
        classes: ['mcdmrpg', 'sheet', 'actor', 'system'],
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
        },
        actions: {
            rollCharacteristic: this.#rollCharacteristic,
            addAbility: this.#addAbilty,
            rollAbility: this.#rollAbility,
            editAbility: this.#editAbility,
            deleteAbility: this.#deleteAbility,
            postAbility: this.#postAbility,
            toggleCondition: this.#toggleCondition,
            toggleMode: this.#toggleMode,
            editPortrait: this.#editPortait,
        },
    };

    async _prepareContext(options) {
        const skills = {};
        Object.keys(game.mcdmrpg.skills).forEach((category) => {
            if (category === 'customSkills') return false;
            for (const skill in this.actor.system.skills[category]) {
                if (this.actor.system.skills[category][skill].proficient || this.actor.system.skills[category][skill].display) {
                    skills[category] ??= {};
                    skills[category][skill] = this.actor.system.skills[category][skill];
                }
            }
        });

        const context = {
            actor: this.actor,
            actorSkills: skills,
            source: this.actor.toObject(),
            fields: this.actor.system.schema.fields,
            activeTabs: this.tabGroups,
            constants: {
                damages: DAMAGE.TYPES,
                abilities: ABILITIES,
                conditions: CONDITIONS,
                skills: game.mcdmrpg.skills,
                characteristics: CHARACTERISTICS,
            },
            isEditable: this.mode === 'edit' && this.actor.canUserModify(game.user, 'update'),
        };

        for (const [group, abilities] of Object.entries(context.actor.abilities)) {
            for (const [index, ability] of abilities.entries()) {
                const enrichContext = {
                    async: true,
                    actor: this.actor,
                    item: ability,
                };
                context.actor.abilities[group][index].system.enrichedEffect = await TextEditor.enrichHTML(ability.system.effect, enrichContext);
                context.actor.abilities[group][index].system.power.enrichedTiers = {
                    one: await TextEditor.enrichHTML(ability.system.power.tiers.one, enrichContext),
                    two: await TextEditor.enrichHTML(ability.system.power.tiers.two, enrichContext),
                    three: await TextEditor.enrichHTML(ability.system.power.tiers.three, enrichContext),
                };
            }
        }

        return context;
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseActorSheet.additionalOptions, { inplace: false });

    static PARTS = {};

    _onRender(context, options) {
        super._onRender(context, options);

        const dd = new DragDrop({
            dropSelector: '.window-content',
            dragSelector: 'div.ability',
            callbacks: {
                drop: this.#onDrop.bind(this),
            },
        });
        dd.bind(this.element);

        let search = new SearchFilter({
            inputSelector: 'input.ability-filter-input',
            contentSelector: '.abilities-list',
            callback: this.#filterAbilities,
        });

        search.bind(this.element.querySelector('.actor-abilities'));
    }

    static #rollCharacteristic(event, target) {
        const characteristic = target.dataset.characteristic;
        this.actor.rollCharacteristic({ characteristic });
    }

    static async #addAbilty(event, target) {
        let item = await this.actor.createEmbeddedDocuments('Item', [{ type: 'ability', name: 'New Ability' }]);
        item[0].sheet.render(true);
        this.render(true);
    }
    static async #rollAbility(event, target) {
        const { abilityId, abilityGroup } = target.closest('.ability').dataset;
        const ability = this.actor.abilities[abilityGroup].find((ability) => ability._id === abilityId);

        ability.roll();
    }
    static async #postAbility(event, target) {
        const { abilityId, abilityGroup } = target.closest('.ability').dataset;
        const ability = this.actor.abilities[abilityGroup].find((ability) => ability._id === abilityId);

        await ability.toChat();
    }
    static #editAbility(event, target) {
        const abilityId = target.dataset.abilityId;
        const abilityItem = this.actor.items.find((item) => item._id === abilityId);

        abilityItem?.sheet.render(true);
    }
    static #deleteAbility(event, target) {
        const abilityId = target.dataset.abilityId;
        const abilityItem = this.actor.items.find((item) => item._id === abilityId);

        this.actor.deleteEmbeddedDocuments('Item', [abilityItem._id]);
    }

    static #toggleCondition(event, target) {
        const conditionId = target.dataset.conditionId;
        this.actor.toggleStatusEffect(conditionId);
    }

    async #onDrop(event) {
        if (!this.actor.isOwner) return false;
        const data = TextEditor.getDragEventData(event);
        const actor = this.actor;
        const allowed = Hooks.call('dropActorSheetData', actor, this, data);
        if (allowed === false) return;

        switch (data.type) {
            case 'Item':
                return this.#onDropItem(event, data);
            case 'Folder':
                return this.#onDropFolder(event, data);
            case 'ActiveEffect':
                return this.#onDropActiveEffect(event, data);
            case 'Actor':
                return false;
        }
    }

    async #onDropItem(event, data) {
        if (!this.actor.isOwner) return false;
        const item = await Item.implementation.fromDropData(data);
        const itemData = item.toObject();

        return this.#onDropItemCreate(itemData, event);
    }

    async #onDropItemCreate(itemData, event) {
        itemData = itemData instanceof Array ? itemData : [itemData];
        return this.actor.createEmbeddedDocuments('Item', itemData);
    }

    async #onDropFolder(event, data) {
        const folder = await Folder.implementation.fromDropData(data);
        if (folder.type !== 'Item') return [];
        const droppedItemData = await Promise.all(
            folder.contents.map(async (item) => {
                if (!(document instanceof Item)) item = await fromUuid(item.uuid);
                return item.toObject();
            })
        );
        return this.#onDropItemCreate(droppedItemData, event);
    }

    async #onDropActiveEffect(event, data) {
        const effect = await ActiveEffect.implementation.fromDropData(data);
        if (!this.actor.isOwner || !effect) return false;
        if (effect.target === this.actor) return false;
        return ActiveEffect.create(effect.toObject(), { parent: this.actor });
    }

    static #toggleMode(event, target) {
        this.mode = this.mode === 'view' ? 'edit' : 'view';
        this.render(true);
    }

    static #editPortait(event, target) {
        const current = foundry.utils.getProperty(this.actor, 'img');
        const fp = new FilePicker({
            current,
            type: 'image',
            callback: (path) => {
                this.actor.update({ img: path });
            },
            top: this.position.top + 40,
            left: this.position.left + 10,
        });
        return fp.browse();
    }

    #filterAbilities(event, searchTerm, regexp, html) {
        const abilities = html.querySelectorAll('.ability');
        if (abilities.length === 0) return;

        const filteredAbilities = [];

        abilities.forEach((ability) => {
            const abilityName = ability.querySelector('.ability-name');
            const abilityType = ability.querySelector('.ability-group-label');
            const abilityKeywords = ability.querySelector('.ability-keywords');
            const abilityTime = ability.querySelector('.ability-time');
            const matchesName = abilityName?.innerText.match(regexp);
            const matchesType = abilityType?.innerText.match(regexp);
            const matchesKeyWords = abilityKeywords?.innerText.match(regexp);
            const matchesTime = abilityTime?.innerText.match(regexp);

            if (matchesName || matchesType || matchesKeyWords || matchesTime) filteredAbilities.push(ability.dataset.abilityId);
        });

        abilities.forEach((ability) => {
            if (!filteredAbilities.includes(ability.dataset.abilityId)) ability.classList.add('hidden');
            else ability.classList.remove('hidden');
        });
    }
}
