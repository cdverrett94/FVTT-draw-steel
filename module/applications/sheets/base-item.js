const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
export class BaseItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
    static additionalOptions = {
        window: {
            icon: 'fas fa-suitcase',
            positioned: true,
        },
        classes: ['mcdmrpg', 'sheet', 'item', 'system'],
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
        },
        actions: {
            addNewEffect: this.addNewEffect,
            editEffect: this.editEffect,
            deleteEffect: this.deleteEffect,
            editImage: this.#editImage,
            deleteGrantedItem: this.#deleteGrantedItem,
        },
    };

    tabGroups = {
        main: 'details',
    };
    defaultTabs = {
        main: 'details',
    };
    mainTabs = {
        details: {
            label: 'system.sheets.items.tabs.details',
            priority: 1,
        },
        effects: {
            label: 'system.general.effect.plural',
            priority: 100,
        },
        grantedItems: {
            label: 'system.sheets.items.tabs.grantedItems',
            priority: 99,
        },
    };

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseItemSheet.additionalOptions, { inplace: false });

    static PARTS = {
        header: {
            id: 'header',
            template: 'systems/mcdmrpg/templates/documents/partials/item-header.hbs',
        },
        tabs: {
            id: 'tabs',
            template: 'systems/mcdmrpg/templates/documents/partials/item-tabs.hbs',
        },
        grantedItems: {
            id: 'granted-items',
            template: 'systems/mcdmrpg/templates/documents/partials/item-granted-items.hbs',
        },
        effects: {
            id: 'effects',
            template: 'systems/mcdmrpg/templates/documents/partials/item-effects.hbs',
        },
    };

    async _prepareContext(options) {
        const context = {
            item: this.item,
            source: this.item.toObject(),
            fields: this.item.system.schema.fields,
            activeTabs: this.tabGroups,
            mainTabs: this.sortedTabs,
            constants: {
                activeEffectModes: Object.entries(CONST.ACTIVE_EFFECT_MODES).reduce((obj, e) => {
                    obj[e[1]] = game.i18n.localize(`EFFECT.MODE_${e[0]}`);
                    return obj;
                }, {}),
            },
        };

        context.grantedItems = [];
        for (let index = 0; index < this.item.system.grantedItems.length; index++) {
            const grantedFeature = await fromUuid(this.item.system.grantedItems[index]);
            context.grantedItems.push(grantedFeature);
        }

        return context;
    }

    get sortedTabs() {
        const objectArray = Object.entries(this.mainTabs);
        objectArray.sort((a, b) => a[1].priority - b[1].priority);

        return Object.fromEntries(objectArray);
    }

    _onRender(context, options) {
        for (const [group, tab] of Object.entries(this.tabGroups)) {
            if (tab === null) this.changeTab(this.defaultTabs[group], group, { force: true });
            else this.changeTab(tab, group, { force: true });
        }

        const dd = new DragDrop({
            dropSelector: '.granted-items',
            callbacks: {
                drop: this.#onDrop.bind(this),
            },
        });
        dd.bind(this.element);
    }

    //#region Effect Management methods
    static async addNewEffect() {
        const created = await ActiveEffect.create({ name: this.item.name }, { parent: this.item });
        created.sheet.render(true);
    }

    static async editEffect(event, target) {
        const { effectId } = target.closest('.item-effect').dataset;
        const effect = this.item.effects.find((effect) => effect.id === effectId);

        await effect.sheet.render(true);
    }

    static async deleteEffect(event, target) {
        const { effectId } = target.closest('.item-effect').dataset;
        this.item.deleteEmbeddedDocuments('ActiveEffect', [effectId]);
    }
    //#endregion

    //#region Drop methods
    async #onDrop(event) {
        if (!this.item.isOwner) return false;
        const data = TextEditor.getDragEventData(event);
        const item = this.item;
        const allowed = Hooks.call('dropItemSheetData', item, this, data);
        if (allowed === false) return;

        switch (data.type) {
            case 'Item':
                return this.onDropItem(event, data);
            case 'Folder':
                return this.onDropFolder(event, data);
            case 'ActiveEffect':
                return this.onDropActiveEffect(event, data);
            default:
                return false;
        }
    }

    async onDropActiveEffect(event, data) {
        const effect = await ActiveEffect.implementation.fromDropData(data);
        if (!this.item.isOwner || !effect) return false;
        if (effect.target === this.item) return false;
        return ActiveEffect.create(effect.toObject(), { parent: this.item });
    }

    async onDropItem(event, data) {
        if (!this.item.isOwner) return false;
        const item = await Item.implementation.fromDropData(data);

        return this.onDropItemCreate(item.uuid, event);
    }

    async onDropFolder(event, data) {
        const folder = await Folder.implementation.fromDropData(data);
        if (folder.type !== 'Item') return [];
        const droppedItemData = folder.contents.map((item) => item.uuid);
        return this.onDropItemCreate(droppedItemData, event);
    }

    async onDropItemCreate(itemData, event) {
        itemData = itemData instanceof Array ? itemData : [itemData];

        const currentItems = this.item.system.grantedItems ?? [];
        const newItems = [...currentItems, ...itemData];

        return await this.item.update({ 'system.grantedItems': newItems });
    }
    //#endregion

    //#region Granted Item methods
    static async #deleteGrantedItem(event, target) {
        let index = Number(target.dataset.grantedItemIndex);
        if (typeof index !== 'number' || Number.isNaN(index)) return;

        let grantedItems = this.item.system.grantedItems;
        grantedItems.splice(index, 1);
        await this.item.update({ 'system.grantedItems': grantedItems });

        this.setPosition({ height: 'auto' });
    }
    //#endregion

    static #editImage(event, target) {
        const current = foundry.utils.getProperty(this.item, 'img');
        const fp = new FilePicker({
            current,
            type: 'image',
            callback: (path) => {
                this.item.update({ img: path });
            },
            top: this.position.top + 40,
            left: this.position.left + 10,
        });
        return fp.browse();
    }
}
