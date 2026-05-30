import * as Phaser from 'phaser';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('preloaderBackground', '/assets/bg.png');
    }

    create() {
        this.scene.start('Preloader');
    }
}