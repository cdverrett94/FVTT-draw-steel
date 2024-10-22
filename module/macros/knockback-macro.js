export async function knockbackMacroPrompt() {
    const { DialogV2 } = foundry.applications.api;
    const dialog = await new Promise((resolve, reject) => {
        new DialogV2({
            window: {
                title: 'Knockback Prompt',
            },
            rejectClose: false,
            buttons: [
                {
                    action: 'knockback',
                    label: 'Knockback',
                    default: true,
                    callback: (event, button, dialog) => button.form.elements.amount.value,
                },
            ],
            content: `
            <div class='ds-property'>
                <div class='label'>Distance</div>
                <div class='value'><input type="number" name="amount" value="0"/></div>
            </div>`,
            submit: async function (result) {
                resolve(result);
            },
        }).render(true);
    });

    if (dialog) {
        const knockbackData = {
            token: game.user.targets.values().next().value,
            distance: dialog,
            action: 'knockback',
        };

        console.log(knockbackData);

        await game['draw-steel'].actions.knockback(knockbackData).request();
    }

    console.log(dialog);
}
