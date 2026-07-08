import * as Phaser from 'phaser';

export class Snowball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'star');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.6);
        this.setBounce(0.3);

        this.scene.time.delayedCall(3000, () => {
            if (this.active) this.destroy();
        });
    }
}
