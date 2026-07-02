import * as Phaser from 'phaser';

export class Demon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'demon');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.health = 1;

        this.speed = 200;
        this.jumpPower = -320;
        this.detectionRange = 500;

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);

        this.body.setSize(this.width * 0.6, this.height * 0.7);
        this.body.setOffset(this.width * 0.2, this.height * 0.3);
    }

    update(player) {
        if (!player || !this.body) return;
        if (this.isStunned) {
            this.setVelocityX(0);
            return;
        }

        const onGround = this.body.blocked.down || this.body.touching.down;

        const distance = Phaser.Math.Distance.Between(
            this.x, this.y, player.x, player.y
        );

        if (distance < this.detectionRange) {
            this.chasePlayer(player, onGround);
        } else {
            this.setVelocityX(0);
        }
    }

    chasePlayer(player, onGround) {
        if (player.x < this.x) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        } else {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        }

        const playerIsAbove = player.y < this.y - 40;
        const blockedByWall = this.body.blocked.left || this.body.blocked.right;

        if (onGround && (playerIsAbove || blockedByWall)) {
            this.setVelocityY(this.jumpPower);
        }
    }

    stun(duration) {
        if (this.isStunned) return;
        this.isStunned = true;
        this.setVelocityX(0);

        this.scene.time.delayedCall(duration, () => {
            if (!this.body) return;
            this.isStunned = false;
        });
    }

    takeDamage(amount) {
        this.stun(300);
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (this.active) this.clearTint();
        });
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.destroy();
    }
}
