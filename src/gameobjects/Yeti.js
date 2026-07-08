import * as Phaser from 'phaser';
import { Enemy } from './Enemy.js';
import { Snowball } from './Snowball.js';

const RETREAT_RANGE = 150;
const THROW_RANGE = 400;
const THROW_COOLDOWN = 1500;
const THROW_TIME_TO_TARGET = 0.8;

export class Yeti extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'yeti',
            health: 3,
            speed: 120,
            jumpPower: -300,
            detectionRange: 450,
            moveDelay: 200,
            bounce: 0.1,
            animations: {
                idle: 'yeti_idle',
                run: 'yeti_run',
                jump: 'yeti_jump',
                fall: 'yeti_fall',
                throw: 'yeti_throw',
            },
        });

        this.canThrow = true;
        this.projectileGroup = scene.physics.add.group();
    }

    // Kiter: retreats if the player gets too close, holds ground and throws
    // an arcing snowball at mid range, advances (reusing the default chase)
    // otherwise.
    decideMovement(player, onGround) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distance > this.detectionRange) {
            this.idle(onGround);
            return;
        }

        if (distance < RETREAT_RANGE) {
            this.retreat(player, onGround);
            return;
        }

        if (onGround && distance < THROW_RANGE && this.canThrow) {
            this.setVelocityX(0);
            this.throwSnowball(player);
            return;
        }

        this.chasePlayer(player, onGround);
    }

    retreat(player, onGround) {
        this.moveTowards(player.x > this.x);
        if (onGround) {
            const isMoving = this.body.velocity.x !== 0;
            this.playAnimation(isMoving ? this.animations?.run : this.animations?.idle);
        }
    }

    throwSnowball(player) {
        this.canThrow = false;
        this.playAnimation(this.animations?.throw);

        const gravityY = this.scene.physics.world.gravity.y;
        const dx = player.x - this.x;
        const dy = (player.y - 20) - this.y;
        const vx = dx / THROW_TIME_TO_TARGET;
        const vy = dy / THROW_TIME_TO_TARGET - 0.5 * gravityY * THROW_TIME_TO_TARGET;

        const snowball = new Snowball(this.scene, this.x, this.y);
        this.projectileGroup.add(snowball);
        snowball.setVelocity(vx, vy);

        this.scene.time.delayedCall(THROW_COOLDOWN, () => {
            this.canThrow = true;
        });
    }

    getProjectileGroup() {
        return this.projectileGroup;
    }

    die() {
        this.projectileGroup.clear(true, true);
        super.die();
    }
}
