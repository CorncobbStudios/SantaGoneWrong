import * as Phaser from 'phaser';
import { Animations } from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.add.text(300, 280, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff'
        });
    }

    preload() {
        this.load.image('sky', '/assets/sky.png');

        this.load.image('background', '/assets/bg.png');

        this.load.image('star', '/objects/star.png');
        this.load.image('bomb', '/objects/bomb.png');
        this.load.image('disc', '/objects/discObject.png');

        this.load.spritesheet('tiles', '/assets/tiles.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('kasey', '/sprites/kaseyspritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet('nk', '/sprites/nkspritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.Animations;
    }

    create() {
        this.textures.get('kasey').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('nk').setFilter(Phaser.Textures.FilterMode.NEAREST);

        this.scene.start('MainMenu');
    }
}