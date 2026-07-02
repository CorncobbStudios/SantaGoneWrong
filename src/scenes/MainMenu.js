import * as Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.add.text(220, 200, 'NEGAVERSE', {
            fontSize: '48px',
            color: '#ffffff'
        });

        this.add.text(260, 300, 'Click to Start', {
            fontSize: '28px',
            color: '#ffffff'
        });

        this.input.once('pointerdown', () => {
            this.scene.start('LevelSelect');
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('LevelSelect');
        });
    }
}