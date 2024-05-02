function createTargetDamageButton(damage, document, targetId, targetUuid) {
    // const damageButton = globalThis.document.createElement('button');
    // damageButton.dataset.targetUuid = targetUuid;
    // damageButton.dataset.targetId = targetId;
    // damageButton.dataset.damageAmount = damage.amount;
    // damageButton.dataset.damageType = damage.type;
    // damageButton.classList.add('apply-damage-button');
    // if (document.system.targets[targetId].applied.damage) {
    //     damageButton.disabled = true;
    //     damageButton.classList.add('disabled');
    //     damageButton.innerText = game.i18n.format('system.rolls.damage.chatDamageButton.applied', {
    //         amount: damage.amount,
    //         type: damage.type !== 'untyped' ? ' ' + game.i18n.localize(`system.damage.types.${damage.type}.label`) : '',
    //     });
    // } else {
    //     damageButton.innerText = game.i18n.format('system.rolls.damage.chatDamageButton.apply', {
    //         amount: damage.amount,
    //         type: damage.type !== 'untyped' ? ' ' + game.i18n.localize(`system.damage.types.${damage.type}.label`) : '',
    //     });
    //     registerDamageTargetListeners(damageButton, document);
    // }
    // return damageButton;
}

function createTargetKnockbackButton(distance, document, targetId, targetUuid, tokenUuid) {
    // const knockbackButton = globalThis.document.createElement('button');
    // knockbackButton.dataset.targetUuid = targetUuid;
    // knockbackButton.dataset.targetId = targetId;
    // knockbackButton.dataset.tokenUuid = tokenUuid;
    // knockbackButton.dataset.knockbackDistance = distance;
    // knockbackButton.classList.add('apply-knockback-button');
    // if (document.system.targets[targetId].applied.knockback) {
    //     knockbackButton.disabled = true;
    //     knockbackButton.classList.add('disabled');
    //     knockbackButton.innerText = `${game.i18n.localize('system.terms.knockback.applied')} ${distance}`;
    // } else {
    //     knockbackButton.innerText = `${game.i18n.localize('system.terms.knockback.label')} ${distance}`;
    //     registerKnockbackTargetListeners(knockbackButton, document);
    // }
    // return knockbackButton;
}

async function addButtonsToTargets(document, html) {
    // if (document.type !== 'ability') return false;
    // const ability = await fromUuid(document.system.origin?.item);
    // html.querySelectorAll('.target-roll').forEach(async (element) => {
    //     const hasPermissions = document.isAuthor || document.testUserPermission(game.user, 3);
    //     console.log(document.isAuthor);
    //     if (!hasPermissions) return;
    //     const { targetUuid, targetId, tokenUuid } = element.dataset;
    //     const targetTier = document.system?.targets?.[targetId]?.tier;
    //     const damage = await ability.getDamageAtTier(targetTier);
    //     const knockback = await ability.getKnockbackAtTier(targetTier);
    //     if (damage.amount !== 0) {
    //         element.appendChild(createTargetDamageButton(damage, document, targetId, targetUuid));
    //     }
    //     if (knockback !== 0) {
    //         element.appendChild(createTargetKnockbackButton(knockback, document, targetId, targetUuid, tokenUuid));
    //     }
    // });
}

function registerDamageTargetListeners(element, document) {
    // element.addEventListener('click', async (event) => {
    //     const { targetUuid, targetId, damageAmount, damageType } = element.dataset;
    //     if (!targetUuid) return ui.notifications.error('No target selected');
    //     const actor = await fromUuid(targetUuid);
    //     await actor.applyDamage({ amount: damageAmount, type: damageType });
    //     const updateData = {
    //         system: {
    //             targets: {},
    //         },
    //     };
    //     updateData.system.targets[targetId] = {
    //         applied: {
    //             damage: true,
    //         },
    //     };
    //     await document.update(updateData);
    // });
}

async function registerKnockbackTargetListeners(element, document) {
    // element.addEventListener('click', async (event) => {
    //     const { targetUuid, targetId, tokenUuid, knockbackDistance } = element.dataset;
    //     if (!targetUuid) return ui.notifications.error('No target selected');
    //     const actor = await fromUuid(targetUuid);
    //     const token = await fromUuid(tokenUuid);
    //     if (!token.parent._view) return ui.notifications.error(`Target token's scene is not viewed. Please view scene ${token.parent.name}`);
    //     const actionTaken = await knockbackAction(token, knockbackDistance);
    //     const updateData = {
    //         system: {
    //             targets: {},
    //         },
    //     };
    //     updateData.system.targets[targetId] = {
    //         applied: {
    //             knockback: true,
    //         },
    //     };
    //     if (actionTaken) {
    //         console.log(document);
    //         await document.update(updateData);
    //     }
    // });
}

async function knockbackAction(token, distance) {
    // const dialogResult = await new Promise((resolve, reject) => {
    //     new foundry.applications.api.DialogV2({
    //         window: { title: 'Choose an option' },
    //         content: `
    //            <label><input type="radio" name="choice" value="prone"> Knock Prone</label>
    //              <label><input type="radio" name="choice" value="knockback" checked> Knock Back</label>
    //            `,
    //         buttons: [
    //             {
    //                 action: 'choice',
    //                 label: 'Make Choice',
    //                 default: true,
    //                 callback: (event, button, dialog) => button.form.elements.choice.value,
    //             },
    //             {
    //                 action: 'cancel',
    //                 label: 'Cancel',
    //                 default: true,
    //                 callback: (event, button, dialog) => dialog.close(),
    //             },
    //         ],
    //         submit: (result) => {
    //             if (result === 'cancel') resolve(false);
    //             else resolve(result);
    //         },
    //     }).render({ force: true });
    // });
    // if (!dialogResult) return false;
    // if (dialogResult === 'knockback') {
    //     let actionTaken = await new Promise((resolve, reject) => {
    //         let x = token.x - canvas.grid.size * distance;
    //         let y = token.y - canvas.grid.size * distance;
    //         let width = canvas.grid.size * distance * 2 + token.width * canvas.grid.size;
    //         let height = canvas.grid.size * distance * 2 + token.height * canvas.grid.size;
    //         let graphics = new PIXI.Graphics();
    //         graphics.beginFill(0xffffff, 0.1);
    //         // set the line style to have a width of 5 and set the color to red
    //         graphics.lineStyle(5, 0x000000);
    //         // draw a rectangle
    //         graphics.drawRect(x, y, width, height);
    //         graphics.endFill();
    //         //canvas.stage.addChild(graphics);
    //         const gridLayer = canvas.interface.grid;
    //         gridLayer.addChild(graphics);
    //         function knockbackMove(event) {
    //             canvas.interface.grid.clearHighlightLayer('knockback');
    //             let mousePosition = canvas.mousePosition;
    //             if (graphics.containsPoint(event.global)) {
    //                 document.body.style.cursor = 'pointer';
    //                 let highlight = canvas.interface.grid.addHighlightLayer('knockback');
    //                 let gridPoint = canvas.grid.getTopLeftPoint({ x: mousePosition.x, y: mousePosition.y });
    //                 highlight.beginFill(0xffffff, 0.5);
    //                 highlight.drawRect(gridPoint.x, gridPoint.y, canvas.grid.size, canvas.grid.size);
    //             } else {
    //                 document.body.style.cursor = 'default';
    //             }
    //         }
    //         async function knockbackClick(event) {
    //             if (graphics.containsPoint(event.global)) {
    //                 document.body.style.cursor = 'default';
    //                 canvas.interface.grid.clearHighlightLayer('knockback');
    //                 graphics.destroy();
    //                 canvas.stage.removeEventListener('click', knockbackClick);
    //                 canvas.stage.removeEventListener('mousemove', knockbackMove);
    //                 let mousePosition = canvas.mousePosition;
    //                 let position = canvas.grid.getTopLeftPoint(mousePosition);
    //                 if (game.user.isGM) {
    //                     updateTargetPosition(token, position);
    //                     return true;
    //                 } else {
    //                     const request = {
    //                         action: 'knockback-request',
    //                         payload: {
    //                             token: token.uuid,
    //                             position,
    //                             randomId: foundry.utils.randomID(),
    //                         },
    //                     };
    //                     let approved = await new Promise((resolveSocket) => {
    //                         game.socket.emit('system.mcdmrpg', request);
    //                         game.socket.on('system.mcdmrpg', (response) => {
    //                             if (response.action === 'knockback-response' && request.payload.randomId === response.payload.randomId) {
    //                                 resolveSocket(response.payload.approved);
    //                             }
    //                         });
    //                     });
    //                     resolve(approved);
    //                 }
    //             }
    //         }
    //         canvas.stage.addEventListener('click', knockbackClick);
    //         canvas.stage.addEventListener('mousemove', knockbackMove);
    //     });
    //     return actionTaken;
    // }
}

async function updateTargetPosition(target, position) {
    console.log(target, position);
    await target.update({ x: position.x, y: position.y });
}

export { addButtonsToTargets };
