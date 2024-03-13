import { BaseActorData } from './base-actor.js';

export class HeroData extends BaseActorData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            victories: new fields.NumberField({
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                nullable: false,
                label: 'system.sheets.actor.victories',
            }),
            xp: new fields.NumberField({
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                nullable: false,
                label: 'system.sheets.actor.xp',
            }),
            recoveries: new fields.SchemaField(
                {
                    current: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                        nullable: false,
                        label: 'system.sheets.actor.recoveries.current',
                    }),
                    max: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                        nullable: false,
                        label: 'system.sheets.actor.recoveries.max',
                    }),
                },
                {
                    label: 'system.sheets.actor.recoveries.label',
                }
            ),
            currentResources: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField(),
                    current: new fields.NumberField(),
                }),
                {
                    label: 'system.sheets.actor.resources',
                }
            ),
        };
    }

    prepareBaseData() {
        super.prepareBaseData();

        this.speed = this.calculateSpeed();
        this.size = this.calculateSize();
        this.resources = this.calculateResources();
        this.reach = this.calculateReach();
    }

    calculateSpeed() {
        let actor = this.parent;
        return Number(actor.ancestry?.system.speed ?? 1) + Number(actor.kit?.system.speed ?? 0);
    }

    calculateSize() {
        let actor = this.parent;
        return {
            width: actor.ancestry?.system.size.width ?? 1,
            length: actor.ancestry?.system.size.length ?? 1,
            height: actor.ancestry?.system.size.height ?? 1,
            weight: actor.ancestry?.system.size.weight ?? 1,
        };
    }

    calculateReach() {
        let actor = this.parent;
        let ancestryReach = Number(actor.ancestry?.system.reach ?? 1);
        let kitReach = Number(actor.kit?.system.reach ?? 0);
        return ancestryReach + kitReach;
    }

    calculateResources() {
        let actor = this.parent;
        const resources = {};

        this.currentResources.forEach((currentResource) => {
            let max;
            let classResource = actor.class.system.resources.find((resource) => resource.name === currentResource.name);

            max = classResource?.max;
            if (max) {
                max = Roll.create(max, actor.getRollData())._evaluateSync().total;
            }

            resources[currentResource.name.slugify()] = {
                name: currentResource.name,
                current: currentResource.current,
                max,
            };
        });
        return resources;
    }
}
