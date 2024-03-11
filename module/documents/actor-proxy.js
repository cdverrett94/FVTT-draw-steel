import { BaseActor, HeroActor, MonsterActor } from './_index.js';

const actorTypes = {
    hero: HeroActor,
    monster: MonsterActor,
};

export const ActorProxy = new Proxy(BaseActor, {
    construct(target, args) {
        const ActorClass = actorTypes[args[0]?.type] ?? BaseActor;
        return new ActorClass(...args);
    },
});
