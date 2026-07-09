import { Enemy } from './Enemy.js';

// Shared plumbing for boss enemies: extra config (meleeRange/attackCooldown)
// for subclasses that mix ranged attacks with chasing, and an optional
// projectile group hook (override getProjectileGroup() if the boss shoots
// something). Defeating a boss just despawns it like a normal Enemy -
// only the actual final boss (NegativeKaseyBoss) ends the game, and it
// triggers Victory itself rather than every Boss doing so.
export class Boss extends Enemy {
    constructor(scene, x, y, config) {
        super(scene, x, y, config);

        this.meleeRange = config.meleeRange ?? 80;
        this.attackCooldown = config.attackCooldown ?? 1500;
        this.canAttack = true;
    }

    getProjectileGroup() {
        return null;
    }
}