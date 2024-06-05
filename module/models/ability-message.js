import { ChatMessageData } from './chat-message.js';

export class AbilityMessageData extends ChatMessageData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            isResistance: new fields.BooleanField(),
            targets: new fields.ObjectField({
                uuid: new fields.DocumentUUIDField(),
                token: new fields.DocumentUUIDField(),
                appliedEffects: new fields.ArrayField(new fields.ObjectField()),
                tier: new fields.NumberField({
                    min: 1,
                    max: 4,
                }),
            }),
        };
    }
}
