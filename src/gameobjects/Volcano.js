import * as Phaser from 'phaser';

export class Volcano extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'volcano');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.fireRate = 2500;
        this.bombSpeed = 250;
        this.bombGroup = scene.physics.add.group();

        this.fireTimer = scene.time.addEvent({
            delay: this.fireRate,
            callback: this.shootBomb,
            callbackScope: this,
            loop: true
        });
    }

    shootBomb() {
        if (!this.active || !this.scene) return;

        const bomb = this.bombGroup.create(this.x, this.y - 30, 'bomb');
        bomb.setScale(1.5);

        // Shoot upward with some random horizontal spread
        const spreadX = Phaser.Math.Between(-100, 100);
        bomb.setVelocity(spreadX, -this.bombSpeed);
        bomb.setBounce(0.4);

        // Destroy bomb after 4 seconds
        this.scene.time.delayedCall(4000, () => {
            if (bomb.active) bomb.destroy();
        });
    }

    getBombGroup() {
        return this.bombGroup;
    }

    destroy(fromScene) {
        if (this.fireTimer) {
            this.fireTimer.remove();
        }
        if (this.bombGroup) {
            this.bombGroup.clear(true, true);
        }
        super.destroy(fromScene);
    }
}
