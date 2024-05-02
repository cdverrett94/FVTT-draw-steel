import { MCDMActiveEffect, MCDMChatMessage, MCDMCombat, MCDMCombatant, MCDMTokenDocument } from '../../documents/_index.js';
import { ActorProxy } from '../../documents/actor-proxy.js';
import { ItemProxy } from '../../documents/item-proxy.js';

export function registerDocumentClasses() {
    CONFIG.Actor.documentClass = ActorProxy;
    CONFIG.Item.documentClass = ItemProxy;
    CONFIG.ActiveEffect.documentClass = MCDMActiveEffect;
    CONFIG.Token.documentClass = MCDMTokenDocument;
    CONFIG.Combat.documentClass = MCDMCombat;
    CONFIG.Combatant.documentClass = MCDMCombatant;
    CONFIG.ChatMessage.documentClass = MCDMChatMessage;
}
