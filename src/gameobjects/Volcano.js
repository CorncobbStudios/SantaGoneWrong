import * as Phaser from 'phaser';
import { Enemy } from './Enemy.js';

const FIRE_RATE = 2500;
const BOMB_SPEED = 250;

// A patrolling hazard-enemy: paces back and forth ignoring the player
// (same wall/ledge-probe patrol as Patroller), and periodically stops to
// erupt, lobbing a bomb into the air. Damageable/killable like any other
// Enemy - the disc-hit and contact-damage wiring is all inherited via
// addEnemy, no special-casing needed.
export class Volcano extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'volcano',
            health: 4,
            speed: 40,
            jumpPower: -300,
            bounce: 0.1,
            animations: {
                idle: 'volcano_idle',
                run: 'volcano_idle',
                jump: 'volcano_idle',
                fall: 'volcano_idle',
                attack: 'volcano_erupt',
            },
        });

        this.patrolDirection = -1;
        this.isErupting = false;
        this.bombGroup = scene.physics.add.group();

        this.fireTimer = scene.time.addEvent({
            delay: FIRE_RATE,
            callback: this.shootBomb,
            callbackScope: this,
            loop: true,
        });
    }

    // Ignores the player entirely - just paces back and forth, reversing at
    // walls/ledges, and freezes in place while erupting.
    decideMovement(player, onGround) {
        if (this.isErupting) {
            this.setVelocityX(0);
            return;
        }

        if (onGround && (this.isBlockedAhead() || !this.hasGroundAhead())) {
            this.patrolDirection *= -1;
        }

        this.moveTowards(this.patrolDirection === -1);
        if (onGround) {
            this.playAnimation(this.animations?.run);
        }
    }

    isBlockedAhead() {
        return this.patrolDirection === -1 ? this.body.blocked.left : this.body.blocked.right;
    }

    hasGroundAhead() {
        const probeX = this.patrolDirection === -1 ? this.body.x - 4 : this.body.right + 4;
        const probeY = this.body.bottom + 2;
        // Ground/platforms are static bodies - overlapRect excludes those by
        // default (includeStatic defaults to false), so it must be passed
        // explicitly or this probe never finds the ground it's standing on.
        return this.scene.physics.overlapRect(probeX, probeY, 4, 8, true, true).length > 0;
    }

    shootBomb() {
        if (!this.active || !this.scene) return;

        this.isErupting = true;
        this.setVelocityX(0);
        this.playAnimation(this.animations?.attack);

        const bomb = this.bombGroup.create(this.x, this.y - 30, 'magmaball');
        bomb.setScale(0.8);

        // Shoot upward with some random horizontal spread
        const spreadX = Phaser.Math.Between(-100, 100);
        bomb.setVelocity(spreadX, -BOMB_SPEED);
        bomb.setBounce(0.4);

        // Destroy bomb after 4 seconds
        this.scene.time.delayedCall(4000, () => {
            if (bomb.active) bomb.destroy();
        });

        this.once('animationcomplete-volcano_erupt', () => {
            if (!this.active) return;
            this.isErupting = false;
            this.playAnimation(this.animations?.run);
        });
    }

    getProjectileGroup() {
        return this.bombGroup;
    }

    die() {
        if (this.fireTimer) this.fireTimer.remove();
        if (this.bombGroup?.children) this.bombGroup.clear(true, true);
        super.die();
    }
}
