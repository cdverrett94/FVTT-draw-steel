const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
export class BaseItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
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
        main: 'details',
    };

    _onRender(context, options) {
        for (const [group, tab] of Object.entries(this.tabGroups)) {
            if (tab === null) this.changeTab(this.defaultTabs[group], group, { force: true });
            else this.changeTab(tab, group, { force: true });
        }
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
            constants: {
                activeEffectModes: Object.entries(CONST.ACTIVE_EFFECT_MODES).reduce((obj, e) => {
                    obj[e[1]] = game.i18n.localize(`EFFECT.MODE_${e[0]}`);
                    return obj;
                }, {}),
            },
        };
    }

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
}
