import * as Phaser from 'phaser';

export class Disc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y , 'disc');

        console.log('direction:', direction);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.startX = x;
        this.body.setAllowGravity(false);
        this.body.setVelocity(direction * 300, 0);
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        if (Math.abs(this.x - this.startX) > 300){
            this.destroy();
        }
    }
}