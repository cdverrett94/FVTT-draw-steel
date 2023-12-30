import { MCDMActor } from './base/base.js';
import { HeroActor } from './heroes/hero.js';

const actorTypes = {
    hero: HeroActor,
};

export const MCDMActorProxy = new Proxy(MCDMActor, {
    construct(target, args) {
        const ActorClass = actorTypes[args[0]?.type] ?? MCDMActor;
        return new ActorClass(...args);
    },
});
