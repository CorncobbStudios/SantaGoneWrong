import * as Phaser from 'phaser';

export class Disc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y , 'disc');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.direction = direction
        this.startX = x;
        this.body.setAllowGravity(false);
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        if (!this.active) return;

        if (Math.abs(this.x - this.startX) > 400){
            this.destroy();
        }
    }
}