import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.currentLevel = data.level || 'Level1';
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        this.add.text(400, 120, 'GAME OVER', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 200, 'Score: ' + this.finalScore, {
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Retry button
        const retryBox = this.add.rectangle(400, 320, 240, 60, 0x16213e)
            .setStrokeStyle(3, 0x0f3460)
            .setInteractive({ useHandCursor: true });

        const retryText = this.add.text(400, 320, 'Retry', {
            fontSize: '28px',
            color: '#e94560'
        }).setOrigin(0.5);

        retryBox.on('pointerover', () => {
            retryBox.setFillStyle(0x0f3460);
            retryText.setColor('#ffffff');
        });
        retryBox.on('pointerout', () => {
            retryBox.setFillStyle(0x16213e);
            retryText.setColor('#e94560');
        });
        retryBox.on('pointerdown', () => {
            this.scene.start(this.currentLevel);
        });

        // Level Select button
        const selectBox = this.add.rectangle(400, 400, 240, 60, 0x16213e)
            .setStrokeStyle(3, 0x0f3460)
            .setInteractive({ useHandCursor: true });

        const selectText = this.add.text(400, 400, 'Level Select', {
            fontSize: '28px',
            color: '#e94560'
        }).setOrigin(0.5);

        selectBox.on('pointerover', () => {
            selectBox.setFillStyle(0x0f3460);
            selectText.setColor('#ffffff');
        });
        selectBox.on('pointerout', () => {
            selectBox.setFillStyle(0x16213e);
            selectText.setColor('#e94560');
        });
        selectBox.on('pointerdown', () => {
            this.scene.start('LevelSelect');
        });

        // Main Menu button
        const menuText = this.add.text(400, 480, 'Main Menu', {
            fontSize: '24px',
            color: '#888888'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuText.on('pointerover', () => menuText.setColor('#ffffff'));
        menuText.on('pointerout', () => menuText.setColor('#888888'));
        menuText.on('pointerdown', () => this.scene.start('MainMenu'));

        // Spacebar to retry
        this.input.keyboard.addKey('SPACE').on('down', () => {
            this.scene.start(this.currentLevel);
        });

        this.add.text(400, 550, 'Press SPACE to retry', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
    }
}
