async function knockbackAction(token, distance) {
    if (dialogResult === 'knockback') {
        let actionTaken = await new Promise((resolve, reject) => {
            let x = token.x - canvas.grid.size * distance;
            let y = token.y - canvas.grid.size * distance;
            let width = canvas.grid.size * distance * 2 + token.width * canvas.grid.size;
            let height = canvas.grid.size * distance * 2 + token.height * canvas.grid.size;
            let graphics = new PIXI.Graphics();

            graphics.beginFill(0xffffff, 0.1);

            // set the line style to have a width of 5 and set the color to red
            graphics.lineStyle(5, 0x000000);

            // draw a rectangle
            graphics.drawRect(x, y, width, height);
            graphics.endFill();

            //canvas.stage.addChild(graphics);
            const gridLayer = canvas.interface.grid;
            gridLayer.addChild(graphics);

            function knockbackMove(event) {
                canvas.interface.grid.clearHighlightLayer('knockback');
                let mousePosition = canvas.mousePosition;
                if (graphics.containsPoint(event.global)) {
                    document.body.style.cursor = 'pointer';
                    let highlight = canvas.interface.grid.addHighlightLayer('knockback');
                    let gridPoint = canvas.grid.getTopLeftPoint({ x: mousePosition.x, y: mousePosition.y });
                    highlight.beginFill(0xffffff, 0.5);
                    highlight.drawRect(gridPoint.x, gridPoint.y, canvas.grid.size, canvas.grid.size);
                } else {
                    document.body.style.cursor = 'default';
                }
            }

            async function knockbackClick(event) {
                if (graphics.containsPoint(event.global)) {
                    document.body.style.cursor = 'default';
                    canvas.interface.grid.clearHighlightLayer('knockback');
                    graphics.destroy();
                    canvas.stage.removeEventListener('click', knockbackClick);
                    canvas.stage.removeEventListener('mousemove', knockbackMove);

                    let mousePosition = canvas.mousePosition;
                    let position = canvas.grid.getTopLeftPoint(mousePosition);

                    if (game.user.isGM) {
                        updateTargetPosition(token, position);
                        return true;
                    } else {
                        const request = {
                            action: 'knockback-request',
                            payload: {
                                token: token.uuid,
                                position,
                                randomId: foundry.utils.randomID(),
                            },
                        };
                        let approved = await new Promise((resolveSocket) => {
                            game.socket.emit('system.mcdmrpg', request);
                            game.socket.on('system.mcdmrpg', (response) => {
                                if (response.action === 'knockback-response' && request.payload.randomId === response.payload.randomId) {
                                    resolveSocket(response.payload.approved);
                                }
                            });
                        });

                        resolve(approved);
                    }
                }
            }

            canvas.stage.addEventListener('click', knockbackClick);
            canvas.stage.addEventListener('mousemove', knockbackMove);
        });

        return actionTaken;
    }
}

class Knockback {
    constructor({ token, distance, action } = {}) {
        this.token = token instanceof Token ? token.document : token;
        this.distance = distance;
        this.action = action;
    }

    #knockBackResolve = null;
    #knockBackReject = null;
    graphics = null;
    result = null;
    requestId = foundry.utils.randomID();
    #clickListener = this.#knockbackClick.bind(this)
    #moveListener = this.#knockbackMove.bind(this)
    #rightClickListener = this.#knockbackRightClick.bind(this)

    static take({ token, distance, action } = {}) {
        return new Knockback({ token, distance, action });
    }

    async request() {
        if (!this.action || !(this.action === 'prone' || this.action === 'knockback')) {
            this.action = await this._requestDialog();
            if (!this.action || !(this.action === 'prone' || this.action === 'knockback')) return false;
        }

        if (this.action === 'knockback') this.result = await this.#knockBack();
        else this.result = await this.#knockProne();

        return this.result;
    }

    async _requestDialog() {
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

    async #knockBack() {
        const actionCompleted = await new Promise((resolve, reject) => {
            console.log('knock back');
            this.#knockBackResolve = resolve;
            this.#knockBackReject = reject;
            this.#createGraphics();

            const gridLayer = canvas.interface.grid;
            gridLayer.addChild(this.graphics);

            canvas.stage.addEventListener('click', this.#clickListener);
            canvas.stage.addEventListener('mousemove', this.#moveListener);
            canvas.stage.addEventListener('contextmenu', this.#rightClickListener);
        });
        
        return actionCompleted;
    }

    #createGraphics() {
        let x = this.token.x - canvas.grid.size * this.distance;
        let y = this.token.y - canvas.grid.size * this.distance;
        let width = canvas.grid.size * this.distance * 2 + this.token.width * canvas.grid.size;
        let height = canvas.grid.size * this.distance * 2 + this.token.height * canvas.grid.size;
        let graphics = new PIXI.Graphics();

        graphics.beginFill(0xff0000, 0.1);

        // set the line style to have a width of 5 and set the color to red
        graphics.lineStyle(5, 0xff0000);

        // draw a rectangle
        graphics.drawRect(x, y, width, height);
        graphics.endFill();

        this.graphics = graphics;
    }

    async #knockProne() {
        console.log('knock prone');
    }

    async #knockbackClick(event) {
        if (this.graphics.containsPoint(event.global)) {
            document.body.style.cursor = 'default';
            canvas.interface.grid.clearHighlightLayer('knockback');
            this.graphics.destroy();
            canvas.stage.removeEventListener('click', this.#clickListener);
            canvas.stage.removeEventListener('mousemove', this.#moveListener);
            document.removeEventListener('contextmenu', this.#rightClickListener);

            let mousePosition = canvas.mousePosition;
            let position = canvas.grid.getTopLeftPoint(mousePosition);

            if (game.user.isGM) {
                await this.#updateTokenPosition({ position });
                this.#knockBackResolve(true);
            } else {
                const request = {
                    action: 'knockback-request',
                    payload: {
                        token: token.uuid,
                        position,
                        randomId: this.requestId,
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

                this.#knockBackResolve(approved);
            }
        }
    }

    #knockbackRightClick(event) {
        document.body.style.cursor = 'default';
        canvas.interface.grid.clearHighlightLayer('knockback');
        this.graphics.destroy();
        canvas.stage.removeEventListener('click', this.#clickListener);
        canvas.stage.removeEventListener('mousemove', this.#moveListener);
        document.removeEventListener('contextmenu', this.#rightClickListener);
    }

    async #knockbackMove(event) {
        canvas.interface.grid.clearHighlightLayer('knockback');
        let mousePosition = canvas.mousePosition;
        if (this.graphics.containsPoint(event.global)) {
            document.body.style.cursor = 'pointer';
            let highlight = canvas.interface.grid.addHighlightLayer('knockback');
            let gridPoint = canvas.grid.getTopLeftPoint({ x: mousePosition.x, y: mousePosition.y });
            highlight.beginFill(0xffffff, 0.5);
            highlight.drawRect(gridPoint.x, gridPoint.y, canvas.grid.size, canvas.grid.size);
        } else {
            document.body.style.cursor = 'default';
        }
    }

    async #updateTokenPosition({ position } = {}) {
        return await this.token.update({ x: position.x, y: position.y });
    }
}

export { Knockback };
