const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheet } = foundry.applications.sheets;
export class BaseItemSheet extends HandlebarsApplicationMixin(ItemSheet) {
    static additionalOptions = {
        window: {
            icon: 'fas fa-suitcase',
            positioned: true,
        },
        classes: ['mcdmrpg', 'sheet', 'item'],
        form: {
            closeOnSubmit: false,
            submitOnChange: true,
        },
        actions: {
            addNewRule: this.addNewRule,
            deleteRule: this.deleteRule,
        },
    };

    tabGroups = {
        main: null,
    };
    defaultTabs = {
        main: 'rules',
    };

    _onRender(context, options) {
        for (const [group, tab] of Object.entries(this.tabGroups)) {
            if (tab === null) this.changeTab(this.defaultTabs[group], group, { force: true });
            else this.changeTab(tab, group, { force: true });
        }
    }

    get item() {
        return this.document;
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, BaseItemSheet.additionalOptions, { inplace: false });

    static PARTS = {
        header: {
            id: 'header',
            template: 'systems/mcdmrpg/templates/documents/partials/item-header.hbs',
            tabs: {
                id: 'tabs',
                template: 'systems/mcdmrpg/templates/documents/partials/item-tabs.hbs',
            },
        },
        tabs: {
            id: 'tabs',
            template: 'systems/mcdmrpg/templates/documents/partials/item-tabs.hbs',
        },
    };

    async _prepareContext(options) {
        return {
            item: this.item,
            source: this.item.toObject(),
            fields: this.item.system.schema.fields,
        };
    }

    static async addNewRule() {
        const updateData = foundry.utils.duplicate(this.item.system.rules);
        updateData.push({
            key: 'AE KEY',
            mode: 2,
            value: 'AE VALUE',
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

    _prepareSubmitData(formData) {
        formData = super._prepareSubmitData(formData);

        Object.entries(formData.system?.rules).forEach((rule) => {
            const [index, ruleData] = rule;
            formData.system.rules[index].predicate = JSON.parse(ruleData.predicate);
        });

        return formData;
    }
}
