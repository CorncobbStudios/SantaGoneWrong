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
        this.load.image('mountfuji', '/assets/mountfuji2.png');        
        this.load.image('star', '/objects/star.png');
        this.load.image('magmaball', '/objects/magmaball.png');
        this.load.image('disc', '/objects/discObject.png');
        this.load.image('mainmenu', '/assets/mainmenu.png');

        // 10x2 grid of 64x64 frames: 0-9 eruption, 10-17 idle, 18-19 empty.
        this.load.spritesheet('volcano', '/sprites/volcanosheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet('demon', '/sprites/demonsprite.png',{
            frameWidth: 64,
            frameHeight: 64
        });

        // Yeti/Krampus art doesn't exist yet - temporarily riding the demon
        // and nk sheets so the new enemy/boss are visible and testable.
        // Swap these paths for real art, then update the matching frame
        // ranges in Animations.js.
        this.load.spritesheet('yeti', '/sprites/demonsprite.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('krampus', '/sprites/nkspritesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet('discSelect', '/assets/discSelector.png',{
            frameWidth: 36,
            frameHeight: 30
        });

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
        this.textures.get('demon').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('volcano').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('yeti').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('krampus').setFilter(Phaser.Textures.FilterMode.NEAREST);

        this.scene.start('MainMenu');
    }
}