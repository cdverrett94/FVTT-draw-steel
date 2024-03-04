import { MCDMActor } from './base/base.js';
import { HeroActor } from './hero/hero.js';
import { MonsterActor } from './monster/monster.js';

const actorTypes = {
    hero: HeroActor,
    monster: MonsterActor,
};

export const MCDMActorProxy = new Proxy(MCDMActor, {
    construct(target, args) {
        const ActorClass = actorTypes[args[0]?.type] ?? MCDMActor;
        return new ActorClass(...args);
    },
});
