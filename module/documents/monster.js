import { BaseActor } from './base-actor.js';

export class MonsterActor extends BaseActor {
    async _preUpdate(changed, options, user) {
        // update prototype token size when size is updated
        let prototypeChanged = false;
        if (changed.system && changed.system.size && 'width' in changed.system.size) {
            changed.prototypeToken ??= {};
            changed.prototypeToken.width = changed.system.size.width;
            prototypeChanged = true;
        }
        if (changed.system && changed.system.size && 'length' in changed.system.size) {
            changed.prototypeToken ??= {};
            changed.prototypeToken.height = changed.system.size.length;
            prototypeChanged = true;
        }

        await super._preUpdate(changed, options, user);

        if (prototypeChanged) {
            for (const token of this.getActiveTokens(true, true)) {
                const keep = ['height', 'width'];
                const prototypeChanges = Object.fromEntries(Object.entries(changed.prototypeToken).filter(([k]) => keep.includes(k)));
                await token.update(prototypeChanges);
            }
        }
    }
}
