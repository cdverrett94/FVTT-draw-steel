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
            addNewRule: this.addNewRule,
            deleteRule: this.deleteRule,
            editImage: this.#editImage,
            deleteGrantedFeature: this.#deleteGrantedFeature,
        },
    };

    tabGroups = {
        main: 'details',
    };
    defaultTabs = {
        main: 'details',
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
        grantedFeatures: {
            id: 'granted-features',
            template: 'systems/mcdmrpg/templates/documents/partials/item-granted-features.hbs',
        },
        rules: {
            id: 'rules',
            template: 'systems/mcdmrpg/templates/documents/partials/item-rules.hbs',
        },
    };

    async _prepareContext(options) {
        const context = {
            item: this.item,
            source: this.item.toObject(),
            fields: this.item.system.schema.fields,
            activeTabs: this.tabGroups,
            constants: {
                activeEffectModes: Object.entries(CONST.ACTIVE_EFFECT_MODES).reduce((obj, e) => {
                    obj[e[1]] = game.i18n.localize(`EFFECT.MODE_${e[0]}`);
                    return obj;
                }, {}),
            },
        };

        context.grantedFeatures = [];
        for (let index = 0; index < this.item.system.grantedFeatures.length; index++) {
            const grantedFeature = await fromUuid(this.item.system.grantedFeatures[index]);
            context.grantedFeatures.push(grantedFeature);
        }

        return context;
    }

    _onRender(context, options) {
        for (const [group, tab] of Object.entries(this.tabGroups)) {
            if (tab === null) this.changeTab(this.defaultTabs[group], group, { force: true });
            else this.changeTab(tab, group, { force: true });
        }

        const dd = new DragDrop({
            dropSelector: '.granted-features',
            callbacks: {
                drop: this.#onDrop.bind(this),
            },
        });
        dd.bind(this.element);
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        if (partId === 'rules') {
            htmlElement.querySelectorAll('textarea')?.forEach((element) => {
                element.onkeydown = function (e) {
                    if (e.keyCode == 9 || e.which == 9) {
                        e.preventDefault();
                        var s = this.selectionStart;
                        this.value = this.value.substring(0, this.selectionStart) + '  ' + this.value.substring(this.selectionEnd);
                        this.selectionEnd = s + 1;
                    }
                };
            });
        }
    }

    _prepareSubmitData(event, form, formData) {
        formData = super._prepareSubmitData(event, form, formData);

        if (formData.system?.rules) {
            Object.entries(formData.system?.rules).forEach((rule) => {
                const [index, ruleData] = rule;
                formData.system.rules[index].predicate = JSON.parse(ruleData.predicate);
            });
        }

        return formData;
    }

    //#region Rule Management methods
    static async addNewRule() {
        const updateData = foundry.utils.duplicate(this.item.system.rules);
        updateData.push({
            key: '',
            mode: 2,
            value: '',
            predicate: [],
        });
        await this.item.update({ system: { rules: updateData } });
    }

    static async deleteRule(event, target) {
        const ruleIndex = target.dataset.ruleIndex;
        const rules = foundry.utils.duplicate(this.item.system.rules);

        rules.splice(ruleIndex, 1);

        this.item.update({ system: { rules } });
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

        const currentItems = this.item.system.grantedFeatures ?? [];
        const newItems = [...currentItems, ...itemData];

        return await this.item.update({ 'system.grantedFeatures': newItems });
    }
    //#endregion

    static async #deleteGrantedFeature(event, target) {
        let index = Number(target.dataset.grantedFeaturesIndex);
        if (typeof index !== 'number') return;

        let grantedFeatures = this.item.system.grantedFeatures;
        grantedFeatures.splice(index, 1);
        await this.item.update({ 'system.grantedFeatures': grantedFeatures });

        this.setPosition({ height: 'auto' });
    }

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
