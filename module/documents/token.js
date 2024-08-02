export class MCDMTokenDocument extends TokenDocument {
    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        this.updateSource({ height: this.actor.system.size, width: this.actor.system.size });
    }

    isFlanking({ target } = {}) {
        const allies = canvas.scene.tokens.filter((token) => token.disposition === this.disposition && token.id !== this.id);
        return allies.some((ally) => {
            const { leftEdge, rightEdge, topEdge, bottomEdge } = target.object.bounds;
            const canSelfReach = this.canReach({ target });
            const canAllyReach = ally.canReach({ target });

            if (!canSelfReach || !canAllyReach) return false;

            const flankingLeftToRight =
                foundry.utils.lineSegmentIntersects(this.object.center, ally.object.center, leftEdge.A, leftEdge.B) &&
                foundry.utils.lineSegmentIntersects(this.object.center, ally.object.center, rightEdge.A, rightEdge.B);
            const flankingTopToBottom =
                foundry.utils.lineSegmentIntersects(this.object.center, ally.object.center, topEdge.A, topEdge.B) &&
                foundry.utils.lineSegmentIntersects(this.object.center, ally.object.center, bottomEdge.A, bottomEdge.B);

            return flankingLeftToRight || flankingTopToBottom;
        });
    }

    canReach({ target } = {}) {
        const selfGridSpaces = this.occupiedGridSpaces();
        const targetGridSpaces = target.occupiedGridSpaces();
        for (let s = 0; s < selfGridSpaces.length; s++) {
            for (let t = 0; t < targetGridSpaces.length; t++) {
                const canReach = canvas.grid.measurePath([selfGridSpaces[s], targetGridSpaces[t]]).distance <= this.actor.system.reach;
                if (canReach) return true;
            }
        }
        return false;
    }

    occupiedGridSpaces() {
        const gridWidth = this.width;
        const gridHeight = this.height;
        const occupiedSpaces = [];

        for (let xAxis = 0; xAxis < gridWidth; xAxis++) {
            for (let yAxis = 0; yAxis < gridHeight; yAxis++) {
                const x = this.x + xAxis * canvas.grid.size;
                const y = this.y + yAxis * canvas.grid.size;
                occupiedSpaces.push(canvas.grid.getCenterPoint({ x, y }));
            }
        }

        return occupiedSpaces;
    }
}
