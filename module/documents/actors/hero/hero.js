import { MCDMActor } from '../base/base.js';

export class HeroActor extends MCDMActor {
    prepareBaseData() {
        super.prepareBaseData();

        this.system.ancestry = this.items.find((item) => item.type === 'ancestry');
        this.system.class = this.items.find((item) => item.type === 'class');
        this.system.kit = this.items.find((item) => item.type === 'kit');

        this.system.resources = {};
        this.system.currentResources.forEach((currentResource) => {
            let max;
            let classResource = this.system.class.system.resources.find((resource) => resource.name === currentResource.name);

            max = classResource?.max;
            if (max) {
                max = Roll.create(max, this.getRollData())._evaluateSync().total;
            }

            this.system.resources[currentResource.name] = {
                current: currentResource.current,
                max,
            };
        });

        this.system.reach = Number(this.system.ancestry?.system.reach ?? 1) + Number(this.system.kit?.system.reach ?? 0);
        this.system.speed = Number(this.system.ancestry?.system.speed ?? 1) + Number(this.system.kit?.system.speed ?? 0);
        this.system.size.width = this.system.ancestry?.system.size.width ?? 1;
        this.system.size.length = this.system.ancestry?.system.size.length ?? 1;
        this.system.size.height = this.system.ancestry?.system.size.height ?? 1;
        this.system.size.weight = this.system.ancestry?.system.size.weight ?? 1;
    }

    _onUpdateDescendantDocuments(parent, collection, documents, changes, options, userId) {
        super._onUpdateDescendantDocuments(parent, collection, documents, changes, options, userId);

        if (collection === 'items') {
            if (documents.find((document) => document.type === 'class') || documents.find((document) => document.type === 'kit')) {
                this._updateActorResources(this.system.class);
            }
        }
    }

    _onCreateDescendantDocuments(parent, collection, documents, changes, options, userId) {
        super._onCreateDescendantDocuments(parent, collection, documents, changes, options, userId);

        let newClass;
        let classDeletions = [];
        let newKit;
        let kitDeletions = [];
        let newAncestry;
        let ancestryDeletions = [];

        if (collection === 'items' && documents.find((document) => document.type === 'class')) {
            classDeletions = this.items.filter((item) => item.type === 'class');
            newClass = classDeletions.pop();

            this._updateActorResources(newClass);
        }

        if (collection === 'items' && documents.find((document) => document.type === 'kit')) {
            kitDeletions = this.items.filter((item) => item.type === 'kit');
            newKit = kitDeletions.pop();
        }

        if (collection === 'items' && documents.find((document) => document.type === 'ancestry')) {
            ancestryDeletions = this.items.filter((item) => item.type === 'ancestry');
            newAncestry = ancestryDeletions.pop();
        }

        let deletionIds = [...classDeletions, ...kitDeletions, ...ancestryDeletions].map((item) => item._id);
        if (deletionIds.length) this.deleteEmbeddedDocuments('Item', deletionIds);
    }

    _updateActorResources(newClass) {
        if (!newClass) return;
        let updateData = [];
        let existingResources = this.system.currentResources;

        newClass.system.resources.forEach((resource) => {
            let existingCurrent = existingResources.find((existingResource) => resource.name === existingResource.name);
            updateData.push({
                name: resource.name,
                current: existingCurrent?.current ?? 0,
            });
        });

        this.update({ 'system.currentResources': updateData });
    }
}
