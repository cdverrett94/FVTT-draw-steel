import { MCDMActiveEffect, MCDMTokenDocument } from '../../documents/_index.js';
import { ActorProxy } from '../../documents/actor-proxy.js';
import { MCDMCombat } from '../../documents/combat.js';
import { MCDMCombatant } from '../../documents/combatant.js';
import { ItemProxy } from '../../documents/item-proxy.js';

export function registerDocumentClasses() {
    CONFIG.Actor.documentClass = ActorProxy;
    CONFIG.Item.documentClass = ItemProxy;
    CONFIG.ActiveEffect.documentClass = MCDMActiveEffect;
    CONFIG.Token.documentClass = MCDMTokenDocument;
    CONFIG.Combat.documentClass = MCDMCombat;
    CONFIG.Combatant.documentClass = MCDMCombatant;
}
