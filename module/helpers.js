async function getRollActor() {
    const speaker = ChatMessage.implementation.getSpeaker();
    const speakerActor = ChatMessage.implementation.getSpeakerActor(speaker);
    let actor;
    if (speakerActor) actor = speakerActor;
    else actor = null;
    return actor;
}

function getDataModelChoices(choices) {
    return Object.entries(choices).reduce((object, current) => {
        object[current[0]] = game.i18n.localize(current[1].label);
        return object;
    }, {});
}

function toId(string) {
    return string.slice(0, 16).padEnd(16, '0');
}

export { getDataModelChoices, getRollActor, toId };
