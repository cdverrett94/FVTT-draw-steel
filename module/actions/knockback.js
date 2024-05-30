class Knockback {
    constructor({ token, distance, action } = {}) {
        this.token = token instanceof Token ? token.document : token;
        this.distance = Number(distance);
        this.action = action;
    }

    #knockBackResolve = null;
    graphics = {
        clickable: undefined,
        highlight: undefined,
    };
    result = null;
    requestId = foundry.utils.randomID();
    #clickListener = this.#knockbackClick.bind(this);
    #moveListener = this.#knockbackMove.bind(this);

    // function to add the knockback action to the game.mcdmrpg.actions namespace
    static do({ token, distance, action } = {}) {
        return new Knockback({ token, distance, action });
    }

    // start the request to knockback
    async request() {
        if (!this.action || !(this.action === 'prone' || this.action === 'knockback')) {
            this.action = await this.#requestDialog();
            if (!this.action || !(this.action === 'prone' || this.action === 'knockback')) return false;
        }

        if (this.action === 'knockback') this.result = await this.#knockBack();
        else this.result = await this.#knockProne();

        return this.result;
    }

    // dialog that shows to requesting user to make a choice of knockback or knock prone
    async #requestDialog() {
        const dialogResult = await new Promise((resolve, reject) => {
            new foundry.applications.api.DialogV2({
                window: { title: 'Choose an option' },
                content: `
                   <label><input type="radio" name="choice" value="knockback" checked> Knockback</label>
                     <label><input type="radio" name="choice" value="prone"> Knock Prone</label>
                   `,
                buttons: [
                    {
                        action: 'choice',
                        label: 'Knockback Action Choice',
                        default: true,
                        callback: (event, button, dialog) => button.form.elements.choice.value,
                    },
                    {
                        action: 'cancel',
                        label: 'Cancel',
                        default: true,
                        callback: (event, button, dialog) => dialog.close(),
                    },
                ],
                submit: (result) => {
                    if (result === 'cancel') resolve(undefined);
                    else resolve(result);
                },
            }).render({ force: true });
        });

        return dialogResult;
    }

    // create the graphics for the hightlighted areas
    #createGraphics({ x, y, width, height, fill = {}, border = {} } = {}) {
        let graphics = new PIXI.Graphics();

        graphics.beginFill(fill.color ?? 0x000000, fill.opacity ?? 1);

        // set the line style to have a width of 5 and set the color to red
        graphics.lineStyle(border.width ?? 0, border.color ?? 0x000000);

        // draw a rectangle
        graphics.drawRect(x, y, width, height);
        graphics.endFill();

        return graphics;
    }

    #createClickableGraphics({ x, y, distance, fill, border }) {
        let graphics = new PIXI.Graphics();

        graphics.beginFill(fill.color ?? 0x000000, fill.opacity ?? 0.1);
        // set the line style to have a width of 5 and set the color to red
        graphics.lineStyle(border.width ?? 1, border.color ?? 0x000000);

        // draw a rectangle
        let polygon;
        // Grid circle
        if (game.settings.get('core', 'gridTemplates')) {
            polygon = new PIXI.Polygon(canvas.grid.getCircle({ x, y }, distance));
        } else {
            // Euclidean circle
            return new PIXI.Circle(x, y, distance * canvas.dimensions.distancePixels);
        }
        graphics.drawPolygon(polygon);
        graphics.endFill();

        graphics.beginHole();
        graphics.drawRect(x - canvas.grid.size * 0.5, y - canvas.grid.size * 0.5, canvas.grid.size, canvas.grid.size);
        graphics.endHole();

        return graphics;
    }

    // render the knockback area and add click and move listeners
    async #knockBack() {
        const actionCompleted = await new Promise((resolve, reject) => {
            this.#knockBackResolve = resolve;
            let x = this.token.x + canvas.grid.size * 0.5;
            let y = this.token.y + canvas.grid.size * 0.5;
            this.graphics.clickable = this.#createClickableGraphics({
                x,
                y,
                distance: this.distance,
                fill: {
                    color: 0xff0000,
                    opacity: 0.1,
                },
                border: {
                    color: 0xff0000,
                    width: 5,
                },
            });

            const layer = canvas.interface.tokens;
            layer.addChild(this.graphics.clickable);

            canvas.stage.addEventListener('click', this.#clickListener);
            canvas.stage.addEventListener('mousemove', this.#moveListener);
        });

        return actionCompleted;
    }

    // knockback click listener to send the knockback location
    async #knockbackClick(event) {
        if (this.graphics.clickable.containsPoint(event.global)) {
            event.preventDefault();
            event.stopPropagation();
            let mousePosition = canvas.mousePosition;
            let position = canvas.grid.getTopLeftPoint(mousePosition);

            if (game.user.isGM) {
                await Knockback.#updateTokenPosition({ token: this.token, position });
                this.#knockBackResolve(true);
            } else {
                const approved = await this.#sendSocketToGM({ position });
                this.#knockBackResolve(approved);
            }
        } else {
            this.#knockBackResolve(false);
        }

        document.body.style.cursor = 'default';
        this.graphics.clickable = this.graphics.clickable.destroy();
        this.graphics.highlight = this.graphics.highlight?.destroy();
        canvas.stage.removeEventListener('click', this.#clickListener);
        canvas.stage.removeEventListener('mousemove', this.#moveListener);
    }

    // knockback move listener to display the highlighted area when in the clickable range
    async #knockbackMove(event) {
        this.graphics.highlight = this.graphics.highlight?.destroy();

        let mousePosition = canvas.mousePosition;
        if (this.graphics.clickable.containsPoint(event.global)) {
            document.body.style.cursor = 'pointer';
            let gridPoint = canvas.grid.getTopLeftPoint({ x: mousePosition.x, y: mousePosition.y });
            this.graphics.highlight = this.#createGraphics({
                x: gridPoint.x,
                y: gridPoint.y,
                width: this.token.width * canvas.grid.size,
                height: this.token.height * canvas.grid.size,
                fill: {
                    color: 0xffffff,
                    opacity: 0.5,
                },
                border: {
                    color: 0xff0000,
                    width: 0,
                },
            });
            const layer = canvas.interface.tokens;
            layer.addChild(this.graphics.highlight);
        } else {
            document.body.style.cursor = 'default';
        }
    }

    // update the target tokens position
    static async #updateTokenPosition({ token, position } = {}) {
        return await token.update({ x: position.x, y: position.y });
    }

    // request to add the prone effect to the target
    async #knockProne() {
        const actionCompleted = await new Promise(async (resolve, reject) => {
            if (game.user.isGM) {
                await Knockback.#addProneEffect({ token: this.token });
                resolve(true);
            } else {
                const approved = await this.#sendSocketToGM();
                resolve(approved);
            }
        });

        return actionCompleted;
    }

    // add the prone effect
    static async #addProneEffect({ token } = {}) {
        return await token.actor.toggleStatusEffect('prone', { active: true });
    }

    // send the request to the GM for approval
    async #sendSocketToGM({ position } = {}) {
        const request = {
            action: 'knockback-request',
            payload: {
                token: this.token.uuid,
                position,
                randomId: this.requestId,
                action: this.action,
                user: game.user,
            },
        };
        let approved = await new Promise((resolveSocket) => {
            game.socket.emit('system.mcdmrpg', request);
            game.socket.on('system.mcdmrpg', (response) => {
                if (response.action === 'knockback-response' && this.requestId === response.payload.randomId) {
                    resolveSocket(response.payload.approved);
                }
            });
        });

        return approved;
    }

    // regiser the sockets for the GM to listen to
    static registerGMSocket() {
        game.socket.on('system.mcdmrpg', async (response) => {
            if (response.action === 'knockback-request') {
                if (game.user !== game.users.activeGM) return false;

                let token = await fromUuid(response.payload.token);
                response.payload.token = token;
                let approved = await Knockback._approveDialog(response);
                if (!approved) response.payload.approved = false;
                else {
                    const actionTaken = response.payload.action;
                    const position = response.payload.position;
                    if (actionTaken === 'knockback') await Knockback.#updateTokenPosition({ token, position });
                    else if (actionTaken === 'prone') await Knockback.#addProneEffect({ token });

                    response.payload.approved = true;
                }

                response.action = 'knockback-response';
                game.socket.emit('system.mcdmrpg', response);
            }
        });
    }

    // GM's approval dialog
    static async _approveDialog(data) {
        const approved = await new Promise((resolve, reject) => {
            new foundry.applications.api.DialogV2({
                window: { title: 'Choose an option' },
                content: `
                <div>${data.payload.user.name} is requesting to knock ${data.payload.token.name} ${data.payload.action === 'knockback' ? 'back' : 'prone'}</div>
                   <label><input type="radio" name="choice" value="approve"> Approve</label>
                     <label><input type="radio" name="choice" value="decline"> Decline</label>
                   `,
                buttons: [
                    {
                        action: 'choice',
                        label: `Approve`,
                        default: true,
                        callback: (event, button, dialog) => button.form.elements.choice.value,
                    },
                    {
                        action: 'cancel',
                        label: 'Cancel',
                        default: true,
                        callback: (event, button, dialog) => dialog.close(),
                    },
                ],
                submit: (result) => {
                    resolve(result === 'approve');
                },
            }).render({ force: true });
        });

        return approved;
    }
}

export { Knockback };
