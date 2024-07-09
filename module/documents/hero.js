import { BaseActor } from './base-actor.js';

export class HeroActor extends BaseActor {
    get ancestry() {
        return this.items.find((item) => item.type === 'ancestry');
    }

    get class() {
        return this.items.find((item) => item.type === 'class');
    }

    get kit() {
        return this.items.find((item) => item.type === 'kit');
    }

    _onUpdateDescendantDocuments(parent, collection, documents, changes, options, userId) {
        super._onUpdateDescendantDocuments(parent, collection, documents, changes, options, userId);

        if (collection === 'items') {
            if (documents.find((document) => document.type === 'class') || documents.find((document) => document.type === 'kit')) {
                this._updateActorResources(this.class);
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

    async _preUpdate(changed, options, user) {
        // Cap resource values to max
        if (changed.system && 'currentResources' in changed.system) {
            changed.system.currentResources = changed.system.currentResources.map((resourceObject) => {
                let { name, current } = resourceObject;
                const slug = name.slugify();
                const max = this.system.resources[slug]?.max ?? Infinity;

                resourceObject.current = Math.clamp(current, 0, max);

                return resourceObject;
            });
        }

        await super._preUpdate(changed, options, user);
    }

    rollOptions(prefix = 'actor') {
        const rollOptions = super.rollOptions(prefix);

        // add class
        rollOptions.push(`${prefix}:class:${this.class?.name.slugify()}`);
        // add kit
        rollOptions.push(`${prefix}:kit:${this.kit?.name.slugify()}`);
        // add ancestry
        rollOptions.push(`${prefix}:ancestry:${this.ancestry?.name.slugify()}`);

        return rollOptions.sort();
    }
}
