import * as Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'kasey');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 160;
        this.jumpPower = -330;
        this.facing = 1;

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.body.setSize(34, 50);
        this.body.setOffset(15, 8);

        this.play('idle');
    }

    update(cursors) {
        if (!cursors) return;

        const onGround =
            this.body.blocked.down ||
            this.body.touching.down;

        // Movement
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            this.facing = -1;
        }
        else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            this.facing = 1;
        }
        else {
            this.setVelocityX(0);
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && onGround) {
            this.setVelocityY(this.jumpPower);
            this.playAnimation('jump_start');
            return;
        }

        // Air animations
        if (!onGround) {
            if (this.body.velocity.y < -75) {
                this.playAnimation('jump_start');
            }
            else if (this.body.velocity.y > 75) {
                this.playAnimation('fall');
            }

            return;
        }

        // Ground animations
        if (cursors.left.isDown || cursors.right.isDown) {
            this.playAnimation('run');
        }
        else {
            this.playAnimation('idle');
        }
    }

    playAnimation(key) {
        if (this.anims.currentAnim?.key !== key) {
            this.play(key);
        }
    }

    getThrowPosition() {
        const offsetX = this.facing === 1 ? 24 : -24;

        return {
            x: this.x + offsetX,
            y: this.y - 18
        };
    }
}