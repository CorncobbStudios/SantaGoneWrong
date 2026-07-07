import { Enemy } from './Enemy.js';

// Shared plumbing for boss enemies: extra config (meleeRange/attackCooldown)
// for subclasses that mix ranged attacks with chasing, an optional
// projectile group hook (override getProjectileGroup() if the boss shoots
// something), and defeating a boss ends the game in a win instead of just
// removing the sprite like a normal Enemy.
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

    die() {
        const scene = this.scene;
        super.die();
        scene.scene.start('Victory');
    }
}