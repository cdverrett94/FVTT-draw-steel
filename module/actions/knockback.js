import { toId } from "../helpers.js";


class Knockback {
    constructor({ token, distance, action } = {}) {
        this.token = token instanceof Token ? token.document : token;
        this.distance = distance;
        this.action = action;
    }

    #knockBackResolve = null;
    graphics = null;
    result = null;
    requestId = foundry.utils.randomID();
    #clickListener = this.#knockbackClick.bind(this);
    #moveListener = this.#knockbackMove.bind(this);

    static take({ token, distance, action } = {}) {
        return new Knockback({ token, distance, action });
    }

    async request() {
        if (!this.action || !(this.action === 'prone' || this.action === 'knockback')) {
            this.action = await this.#requestDialog();
            if (!this.action || !(this.action === 'prone' || this.action === 'knockback')) return false;
        }

        if (this.action === 'knockback') this.result = await this.#knockBack();
        else this.result = await this.#knockProne();

        return this.result;
    }

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

    async #knockBack() {
        const actionCompleted = await new Promise((resolve, reject) => {
            this.#knockBackResolve = resolve;
            this.#createGraphics();

            const gridLayer = canvas.interface.grid;
            gridLayer.addChild(this.graphics);

            canvas.stage.addEventListener('click', this.#clickListener);
            canvas.stage.addEventListener('mousemove', this.#moveListener);
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
        const actionCompleted = await new Promise(async (resolve, reject) => {
            if (game.user.isGM) {
                await Knockback.#addProneEffect({token: this.token});
                resolve(true);
            } else {
                const approved = await this.#sendSocketToGM();
                resolve(approved);
            }
        });

        return actionCompleted;
    }

    async #knockbackClick(event) {
        if (this.graphics.containsPoint(event.global)) {
            let mousePosition = canvas.mousePosition;
            let position = canvas.grid.getTopLeftPoint(mousePosition);

            if (game.user.isGM) {
                await Knockback.#updateTokenPosition({ token: this.token, position });
                this.#knockBackResolve(true);
            } else {
                const approved = await this.#sendSocketToGM({position});
                this.#knockBackResolve(approved);
            }
        } else {
            this.#knockBackResolve(false)
        }

        document.body.style.cursor = 'default';
        canvas.interface.grid.clearHighlightLayer('knockback');
        this.graphics.destroy();
        canvas.stage.removeEventListener('click', this.#clickListener);
        canvas.stage.removeEventListener('mousemove', this.#moveListener);
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

    static async #updateTokenPosition({ token, position } = {}) {
        return await token.update({ x: position.x, y: position.y });
    }

    static async #addProneEffect({token} ={}) {
        return await token.actor.toggleStatusEffect('prone', {active: true});
    }

    async #sendSocketToGM({position} = {}) {
        const request = {
            action: 'knockback-request',
            payload: {
                token: this.token.uuid,
                position,
                randomId: this.requestId,
                action: this.action,
                user:game.user
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

    static registerGMSocket() {
        game.socket.on('system.mcdmrpg', async (response) => {
            if (response.action === 'knockback-request') {
                if (game.user !== game.users.activeGM) return false;

                let token = await fromUuid(response.payload.token);
                response.payload.token = token;
                let approved = await Knockback._approveDialog(response);
                if (!approved) response.payload.approved = false;
                else {
                    
                    const actionTaken = response.payload.action
                    const position = response.payload.position;
                    if(actionTaken === 'knockback') await Knockback.#updateTokenPosition({token, position})
                    else if(actionTaken=== 'prone') await Knockback.#addProneEffect({token})

                    response.payload.approved =  true;
                }
                

                response.action = 'knockback-response';
                game.socket.emit('system.mcdmrpg', response);
            }
        });
    }
    
    static async _approveDialog(data) {
        const approved = await new Promise((resolve, reject) => {
            new foundry.applications.api.DialogV2({
                window: { title: 'Choose an option' },
                content: `
                <div>${data.payload.user.name} is requesting to knock ${data.payload.token.name} ${data.payload.action === 'knockback'? 'back': 'prone'}</div>
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
