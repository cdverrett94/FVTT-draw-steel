async function getRollActor() {
    const speaker = ChatMessage.implementation.getSpeaker();
    const speakerActor = ChatMessage.implementation.getSpeakerActor(speaker);
    let actor;
    if (speakerActor) actor = speakerActor;
    else actor = null;
    return actor;
}

async function migrateItems(items) {
    for (const id of items.invalidDocumentIds) {
        const item = items.getInvalid(id);
        if (item.type === 'ability') {
            let updateData;
            let itemTime = item.validationFailures.fields.fields.system.fields.time.invalidValue;
            if (itemTime === 'Free Manuever') updateData = 'free-maneuver';
            else if (itemTime === 'Maneuver') updateData = 'maneuver';
            else if (itemTime === 'Free Triggered Action') updateData = 'free-triggered';
            else if (itemTime === 'Free Manuever') updateData = 'free-maneuver';
            else if (itemTime === 'Maneuver') updateData = 'maneuver';
            else if (itemTime === 'Free Triggered Action') updateData = 'free-triggered';
            else if (itemTime === 'Triggered') updateData = 'triggered';

            await item.update({ system: { time: updateData } });
        }
    }
}

async function migrateData() {
    game.actors.contents.forEach(async (actor) => {
        migrateItems(actor.items);
    });

    migrateItems(game.items);
}

export { getRollActor };
