import * as Phaser from 'phaser';

export class Disc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y , 'disc');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.startX = x;
        this.body.allowGravity = false;
        this.setVelocityX(direction * 300);
        console.log('direction', direction);
        console.log('velocity', direction * 300);

    
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
console.log(
    this.x,
    this.y,
    this.body.velocity.x,
    this.body.velocity.y
);
        if (Math.abs(this.x - this.startX) > 300){
            this.destroy();
        }
    }
}