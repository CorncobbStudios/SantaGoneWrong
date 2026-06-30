import * as Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    // x and y are player starting position
    constructor(scene, x, y) {
        // this is using texture of the sprite
        super(scene, x, y, 'kasey');

        // draws the sprite to the scene
        scene.add.existing(this);
        // adds arcade physics to the sprite
        scene.physics.add.existing(this);

        this.speed = 160;
        this.jumpPower = -330;
        this.facing = 1;

        this.setBounce(0);
        this.setCollideWorldBounds(true);

        // setting collision box
        this.body.setSize(42, 60);
        // change to offset collision box
        //this.body.setOffset(15, 0);

        this.play('idle');
    }

    update(cursors) {
        if (!cursors) return;

        // checks if physics body is touching ground
        const onGround = this.body.blocked.down || this.body.touching.down;

        // Movement
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            this.facing = -1;
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            this.facing = 1;
        } else {
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
            // if player is going up
            if (this.body.velocity.y < -75) {
                this.playAnimation('jump_start');
            }
            // if player is going down
            else if (this.body.velocity.y > 75) {
                this.playAnimation('fall');
            }
            return;
        }

        // Ground animations
        if (cursors.left.isDown || cursors.right.isDown) {
            this.playAnimation('run');
        } else {
            this.playAnimation('idle');
        }
    }

    playAnimation(key) {
        // checks to see if we are already playing the current animation
        if (this.anims.currentAnim?.key === key) {
            return;
        }
        this.play(key);
    }

    getThrowPosition() {
        const offsetX = this.facing === 1 ? 24 : -24;

        return {
            x: this.x + offsetX,
            y: this.y - 18,
        };
    }
}
