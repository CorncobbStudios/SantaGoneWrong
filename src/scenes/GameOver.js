import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        this.add.text(260, 200, 'GAME OVER', {
            fontSize: '48px',
            color: '#ffffff'
        });

        this.add.text(300, 280, 'Score: ' + this.finalScore, {
            fontSize: '28px',
            color: '#ffffff'
        });

        this.add.text(220, 360, 'Click to Restart', {
            fontSize: '28px',
            color: '#ffffff'
        });

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        });
    }
}