import { MCDMActiveEffect } from '../../documents/active-effects/active-effects.js';
import { MCDMActorProxy } from '../../documents/actors/actor-proxy.js';
import { MCDMItemProxy } from '../../documents/items/item-proxy.js';
import { MCDMTokenDocument } from '../../documents/tokens/token.js';

export function registerDocumentClasses() {
    CONFIG.Actor.documentClass = MCDMActorProxy;
    CONFIG.Item.documentClass = MCDMItemProxy;
    CONFIG.ActiveEffect.documentClass = MCDMActiveEffect;
    CONFIG.Token.documentClass = MCDMTokenDocument;
}
