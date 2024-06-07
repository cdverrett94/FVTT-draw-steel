import { ABILITIES, CHARACTERISTICS, CONDITIONS, DAMAGE, SKILLS } from '../../constants/_index.js';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
export class BaseActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    constructor(...args) {
        super(...args);
        this.filters = {
            time: null,
            type: null,
        };
        this.mode = 'view';
    }

    tabGroups = {
        main: null,
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
            filterAbilities: this.#filterAbilities,
            toggleCondition: this.#toggleCondition,
            toggleMode: this.#toggleMode,
        },
    };

    async _prepareContext(options) {
        const skills = {};
        Object.keys(SKILLS).forEach((category) => {
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
            filters: this.filters,
            activeTabs: this.tabGroups,
            constants: {
                damages: DAMAGE.TYPES,
                abilities: ABILITIES,
                conditions: CONDITIONS,
                skills: SKILLS,
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
                let isCurrentTypeFilter = ability.system.type === this.filters.type;
                let isCurrentTimeFilter = ability.system.time === this.filters.time;
                let noFilters = !this.filters.type && !this.filters.time;
                if (isCurrentTypeFilter || isCurrentTimeFilter || noFilters) ability.show = true;
                else ability.show = false;
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
    static async #filterAbilities(event, target) {
        const { filter, selection } = target.dataset;
        if (selection === 'clear') {
            this.filters = {
                type: null,
                time: null,
            };
        } else {
            const secondaryFilter = filter === 'type' ? 'time' : 'type';
            this.filters[filter] = selection === 'clear' ? null : selection;
            this.filters[secondaryFilter] = null;
        }

        await this.render({ parts: ['abilities'] });
        this.setPosition({ height: 'auto' });
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
}
