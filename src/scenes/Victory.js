import { Scene } from 'phaser';

export class Victory extends Scene {
    constructor() {
        super('Victory');
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');

        this.add.text(400, 120, 'VICTORY!', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 200, 'You defeated Negative Kasey!', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const selectBox = this.add.rectangle(400, 320, 240, 60, 0x16213e)
            .setStrokeStyle(3, 0x0f3460)
            .setInteractive({ useHandCursor: true });

        const selectText = this.add.text(400, 320, 'Level Select', {
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

        const menuText = this.add.text(400, 400, 'Main Menu', {
            fontSize: '24px',
            color: '#888888'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuText.on('pointerover', () => menuText.setColor('#ffffff'));
        menuText.on('pointerout', () => menuText.setColor('#888888'));
        menuText.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}