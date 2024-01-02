export class MonsterSheet extends ActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['mcdmrpg', 'sheet', 'actor', 'monster'],
            template: `/systems/mcdmrpg/module/documents/actors/monster/sheet/monster-sheet.hbs`,
            tabs: [
                /*{
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },*/
            ],
            // scrollY: ['.skill-list', '.tabbed-content'],
            width: 1230,
            height: 930,
            resizable: true,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = {
            name: this.actor.name,
            img: this.actor.img,
            ...this.actor.system,
        };

        // Enrich Content
        let enrichContext = {
            async: true,
            actor: this.actor,
            replaceCharacteristic: true,
            applyKitDamage: true,
        };

        for (const [group, abilities] of Object.entries(data.abilities)) {
            for (const [index, ability] of abilities.entries()) {
                data.abilities[group][index].system.enrichedDamage = await TextEditor.enrichHTML(ability.system.damage, enrichContext);
                data.abilities[group][index].system.enrichedEffect = await TextEditor.enrichHTML(ability.system.effect, enrichContext);
            }
        }

        data.chanceHit = await TextEditor.enrichHTML(data.chanceHit, enrichContext);

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];
    }
}
