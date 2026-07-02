import * as Phaser from 'phaser';

export class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        this.add.text(400, 100, 'SELECT LEVEL', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const levels = [
            { label: 'Level 1', scene: 'Level1', x: 150 },
            { label: 'Level 2', scene: 'Level2', x: 400 },
            { label: 'Level 3', scene: 'Level3', x: 650 }
        ];

        levels.forEach(({ label, scene, x }) => {
            this.createLevelButton(x, 300, label, scene);
        });

        const backText = this.add.text(400, 500, 'Back to Menu', {
            fontSize: '24px',
            color: '#888888'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backText.on('pointerover', () => backText.setColor('#ffffff'));
        backText.on('pointerout', () => backText.setColor('#888888'));
        backText.on('pointerdown', () => this.scene.start('MainMenu'));
    }

    createLevelButton(x, y, label, sceneName) {
        const box = this.add.rectangle(x, y, 160, 160, 0x16213e)
            .setStrokeStyle(3, 0x0f3460)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y, label, {
            fontSize: '28px',
            color: '#e94560'
        }).setOrigin(0.5);

        box.on('pointerover', () => {
            box.setFillStyle(0x0f3460);
            text.setColor('#ffffff');
        });

        box.on('pointerout', () => {
            box.setFillStyle(0x16213e);
            text.setColor('#e94560');
        });

        box.on('pointerdown', () => {
            this.scene.start(sceneName);
        });
    }
}
