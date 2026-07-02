import * as Phaser from 'phaser';
import { Disc } from './Disc';

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
        this.attackCooldown = 0;
        this.isAttacking = false;

        this.setBounce(0);
        this.setCollideWorldBounds(true);

        // setting collision box
        this.body.setSize(42, 60);
        // change to offset collision box
        //this.body.setOffset(15, 0);

        this.play('idle');

        this.on('animationupdate', (anim, frame) => {
            if (anim.key === 'throw' && frame.index === 4) {
                const pos = this.getThrowPosition();
                this.scene.createDisc( pos, this.facing);
            }
        });

        this.on('animationcomplete-throw', (anim) => {
            if (anim.key === 'throw'){
                this.anims.stop();
                this.isAttacking = false;
                this.play('idle', true);
            }
        });
    }

    update(cursors) {
        if (this.attackCooldown > 0){
            this.attackCooldown--;
        }
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
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && onGround && !this.isAttacking) {
            this.setVelocityY(this.jumpPower);
            this.playAnimation('jump_start');
            return;
        }

        // Don't override throw animation with any other animation
        if (this.isAttacking) {
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
        const offsetX = this.facing === 1 ? 50 : -50;

        return {
            x: this.x + offsetX,
            y: this.y,
        };
    }

    throwDisc() {
        if (this.attackCooldown > 0 || this.isAttacking) {
            return;
        }

        this.isAttacking = true;
        this.attackCooldown = 15;

        this.play('throw', true);
    }

}
