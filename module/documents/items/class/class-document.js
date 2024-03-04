import { MCDMRPGItem } from '../base/base-document.js';

export class MCDMRPGClassItem extends MCDMRPGItem {
    async _preUpdate(changed, options, user) {
        await super._preUpdate(changed, options, user);
        if ('resources' in (changed.system || {})) {
            if (!Array.isArray(changed.system.resources)) {
                changed.system.resources = Object.values(changed.system.resources);
            }
        }
    }
}
