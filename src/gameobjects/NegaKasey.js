import * as Phaser from 'phaser';

export class NegativeKasey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'negativeKasey');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.health = 3;

        this.speed = 120;
        this.jumpPower = -280;
        this.detectionRange = 300;
        this.delay = 500;

        this.setBounce(0.1);
        this.setCollideWorldBounds(true);

        this.body.setSize(34, 50);
        this.body.setOffset(15, 8);

        this.play('negative_idle');
        this.moveTimer = null;
        this.jumpTimer = null;
    }

    update(player) {
        if (!player || !this.body) return;

        const onGround = this.body.blocked.down || this.body.touching.down;

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y,
        );

        if (distance < this.detectionRange) {
            this.chasePlayer(player, onGround);
        } else {
            this.idle(onGround);
        }

        this.updateAirAnimation(onGround);
    }

    chasePlayer(player, onGround) {
        if (player.x < this.x) {
            this.moveTimer = this.scene.time.delayedCall(this.delay, () => {
                if (!this.body) return;
                this.setVelocityX(-this.speed);
                this.setFlipX(true);
            });
        } else {
            this.moveTimer = this.scene.time.delayedCall(this.delay, () => {
                if (!this.body) return;
                this.setVelocityX(this.speed);
                this.setFlipX(false);
            });
        }

        // Jump if player is above Negative Kasey
        const playerIsAbove = player.y < this.y - 40;

        // Jump if enemy hits a wall while chasing
        const blockedByWall = this.body.blocked.left || this.body.blocked.right;

        if (onGround && (playerIsAbove || blockedByWall)) {
            this.jump();
            return;
        }

        if (onGround) {
            this.playAnimation('negative_run');
        }
    }

    jump() {
        this.jumpTimer = this.scene.time.delayedCall(this.delay, () => {
            if (!this.body) return;
            this.setVelocityY(this.jumpPower);
            this.playAnimation('negative_jump');
        });
    }

    idle(onGround) {
        this.setVelocityX(0);

        if (onGround) {
            this.playAnimation('negative_idle');
        }
    }

    updateAirAnimation(onGround) {
        if (onGround) return;

        if (this.body.velocity.y < -75) {
            this.playAnimation('negative_jump');
        } else if (this.body.velocity.y > 75) {
            this.playAnimation('negative_fall');
        }
    }

    playAnimation(key) {
        if (this.anims.currentAnim?.key !== key) {
            this.play(key);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
        if (this.health <=0 ){
            this.die();
        }
    }
    die(){
        //particle
        //score
        if (this.moveTimer){
            this.moveTimer.remove();
        }
        if (this.jumpTimer){
            this.jumpTimer.remove();
        }
        this.destroy();
    }
}
