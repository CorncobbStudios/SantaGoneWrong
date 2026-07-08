import * as Phaser from 'phaser';
import { Boss } from './Boss.js';
import { Snowball } from './Snowball.js';

// Deliberately simpler than NegativeKaseyBoss - no phases/dodge/platform
// climb, just a single enrage threshold and a charge-dash / ground-slam
// pattern based on distance to the player.
const CHARGE_BAND_MAX = 350;
const ENRAGE_THRESHOLD = 0.5;
const CHARGE_TELEGRAPH_MS = 400;
const CHARGE_DURATION_MS = 300;
const SLAM_TELEGRAPH_MS = 400;

export class KrampusBoss extends Boss {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'krampus',
            health: 15,
            speed: 130,
            jumpPower: -300,
            detectionRange: 550,
            meleeRange: 80,
            attackCooldown: 1200,
            bounce: 0.1,
            animations: {
                idle: 'krampus_idle',
                run: 'krampus_run',
                jump: 'krampus_jump',
                fall: 'krampus_fall',
                charge: 'krampus_charge',
                slam: 'krampus_slam',
            },
        });

        this.maxHealth = 15;
        this.shockwaveGroup = scene.physics.add.group();
    }

    getAttackCooldown() {
        const enraged = this.health / this.maxHealth <= ENRAGE_THRESHOLD;
        return enraged ? this.attackCooldown * 0.6 : this.attackCooldown;
    }

    decideMovement(player, onGround) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distance > this.detectionRange) {
            this.idle(onGround);
            return;
        }

        if (distance <= this.meleeRange || !this.canAttack) {
            this.chasePlayer(player, onGround);
            return;
        }

        if (distance <= CHARGE_BAND_MAX) {
            this.chargeAttack(player);
        } else {
            this.groundSlam();
        }
    }

    chargeAttack(player) {
        this.canAttack = false;
        this.setVelocityX(0);
        this.setTint(0xffff00);
        this.playAnimation(this.animations?.charge);

        const direction = player.x < this.x ? -1 : 1;

        this.scene.time.delayedCall(CHARGE_TELEGRAPH_MS, () => {
            if (!this.active) return;
            this.clearTint();
            this.setVelocityX(direction * this.speed * 3);
        });

        this.scene.time.delayedCall(CHARGE_TELEGRAPH_MS + CHARGE_DURATION_MS, () => {
            if (!this.active) return;
            this.setVelocityX(0);
        });

        this.scene.time.delayedCall(this.getAttackCooldown(), () => {
            if (this.active) this.canAttack = true;
        });
    }

    groundSlam() {
        this.canAttack = false;
        this.setVelocityX(0);
        this.playAnimation(this.animations?.slam);

        this.scene.time.delayedCall(SLAM_TELEGRAPH_MS, () => {
            if (!this.active) return;

            const left = new Snowball(this.scene, this.x, this.y);
            const right = new Snowball(this.scene, this.x, this.y);
            this.shockwaveGroup.add(left);
            this.shockwaveGroup.add(right);
            left.setVelocity(-200, -150);
            right.setVelocity(200, -150);
        });

        this.scene.time.delayedCall(this.getAttackCooldown(), () => {
            if (this.active) this.canAttack = true;
        });
    }

    getProjectileGroup() {
        return this.shockwaveGroup;
    }

    die() {
        this.shockwaveGroup.clear(true, true);
        super.die();
    }
}
