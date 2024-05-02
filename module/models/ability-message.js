import { ChatMessageData } from './chat-message.js';

export class AbilityMessageData extends ChatMessageData {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...super.defineSchema(),
            targets: new fields.ObjectField({
                uuid: new fields.DocumentUUIDField(),
                token: new fields.DocumentUUIDField(),
                applied: new fields.SchemaField({
                    damage: new fields.BooleanField({
                        initial: false,
                    }),
                    knockback: new fields.BooleanField({
                        initial: false,
                    }),
                }),
                tier: new fields.NumberField({
                    min: 1,
                    max: 4,
                }),
            }),
        };
    }
}
