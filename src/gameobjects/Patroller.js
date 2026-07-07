import * as Phaser from 'phaser';
import { Enemy } from './Enemy.js';

export class Patroller extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'demon',
            health: 2,
            speed: 100,
            jumpPower: -320,
            detectionRange: 200,
            bounce: 0.1,
            facesLeft: true,
            animations: {
                idle: 'demon_idle',
                run: 'demon_run',
                jump: 'demon_jump',
                fall: 'demon_jump',
            },
        });

        this.patrolDirection = -1;
    }

    decideMovement(player, onGround) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distance < this.detectionRange) {
            this.chasePlayer(player, onGround);
            return;
        }

        this.patrol(onGround);
    }

    patrol(onGround) {
        if (onGround && (this.isBlockedAhead() || !this.hasGroundAhead())) {
            this.patrolDirection *= -1;
        }

        this.moveTowards(this.patrolDirection === -1);

        if (onGround) {
            const isMoving = this.body.velocity.x !== 0;
            this.playAnimation(isMoving ? this.animations?.run : this.animations?.idle);
        }
    }

    isBlockedAhead() {
        return this.patrolDirection === -1
            ? this.body.blocked.left
            : this.body.blocked.right;
    }

    hasGroundAhead() {
        const probeWidth = 4;
        const probeHeight = 8;
        const x = this.patrolDirection === -1
            ? this.body.left - probeWidth
            : this.body.right;
        const y = this.body.bottom + 2;

        const bodies = this.scene.physics.overlapRect(x, y, probeWidth, probeHeight, false, true);
        return bodies.length > 0;
    }
}