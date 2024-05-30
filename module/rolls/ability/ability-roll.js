import { PowerRoll } from '../_index.js';

export class AbilityRoll extends PowerRoll {
    static CHAT_TEMPLATE = 'systems/mcdmrpg/templates/chat-messages/ability-message.hbs';

    get abilityTierEffect() {
        if (!this.ability) return null;
        return this.ability.getTierEffect(this.tier);
    }
}
