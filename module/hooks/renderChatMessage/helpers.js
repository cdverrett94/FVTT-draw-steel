function createTargetButton(document, dataset = {}, classes = [], text = '', disabled = false, registerListeners) {
    const targetButton = globalThis.document.createElement('button');

    Object.assign(targetButton.dataset, dataset);
    targetButton.classList.add(...classes);
    targetButton.innerText = text;

    if (disabled) {
        targetButton.disabled = true;
        targetButton.classList.add('disabled');
    } else {
        registerListeners(targetButton, document, dataset.index);
    }

    return targetButton;
}

async function setEffectApplied(document, targetId, index) {
    const updateData = {
        system: {
            targets: {},
        },
    };

    let appliedEffects = foundry.utils.duplicate(document.system.targets[targetId].appliedEffects);
    appliedEffects[index].applied = true;
    updateData.system.targets[targetId] = {
        appliedEffects,
    };
    await document.update(updateData);
}

export { createTargetButton, setEffectApplied };
