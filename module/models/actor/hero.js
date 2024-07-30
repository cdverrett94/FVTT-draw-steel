import { BaseActorData } from '../_index.js';

export class HeroData extends BaseActorData {
    static LOCALIZATION_PREFIXES = ['system.actors.base', 'system.actors.hero'];
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
            }),
            xp: new fields.NumberField({
                required: true,
                initial: 0,
                min: 0,
                integer: true,
                nullable: false,
            }),
            recoveries: new fields.SchemaField({
                current: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                }),
                max: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                    nullable: false,
                }),
            }),
            currentResources: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({
                        label: 'system.actors.hero.FIELDS.currentResources.name.label',
                    }),
                    current: new fields.NumberField({
                        label: 'system.actors.hero.FIELDS.currentResources.current.label',
                        integer: true,
                        min: 0,
                    }),
                }),
                { initial: [] }
            ),
            hope: new fields.NumberField({
                initial: 0,
                integer: true,
                min: 0,
            }),
        };
    }

    prepareBaseData() {
        super.prepareBaseData();

        this.speed = this.calculateSpeed();
        this.size = this.calculateSize();
        this.resources = this.calculateResources();
        this.calculateResourcesMax();
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
        const resources = {};

        this.currentResources.forEach((currentResource) => {
            resources[currentResource.name.slugify()] = {
                name: currentResource.name,
                current: currentResource.current,
            };
        });

        return resources;
    }

    calculateResourcesMax() {
        for (const resource in this.resources) {
            let max;
            let actor = this.parent;
            let classResource = actor.class.system.resources.find((classResource) => classResource.name === this.resources[resource].name);

            max = classResource?.max;
            if (max) {
                max = Roll.create(max, actor.getRollData())._evaluateSync().total;
                this.resources[resource].max = max;
            }
        }
    }
}
