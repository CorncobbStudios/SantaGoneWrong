import * as Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }


    create() {

        this.add.image(0, 120, 'mainmenu')
            .setOrigin(0)
            .setScale(2.5);

        this.options = [
            'START',
            'LOAD',
            'CONFIG',
            'QUIT'
        ];

        this.selected = 0;
        this.menuItems = [];

        const startY = 275;

        this.options.forEach((option, index) => {

            const text = this.add.text(
                330,
                startY + (index * 40),
                option,
                {
                    fontFamily: 'monospace',
                    fontSize: '30px',
                    color: '#ffffff'
                }
            );

            this.menuItems.push(text);
        });

        this.updateSelection();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-UP', () => {
            this.selected =
                (this.selected - 1 + this.options.length)
                % this.options.length;

            this.updateSelection();
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            this.selected =
                (this.selected + 1)
                % this.options.length;

            this.updateSelection();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.selectOption();
        });
    }

    updateSelection() {

        this.menuItems.forEach((item, index) => {

            if (index === this.selected) {
                item.setText(`> ${this.options[index]}`);
                item.setColor('#85c3db');
            } else {
                item.setText(`  ${this.options[index]}`);
                item.setColor('#ffffff');
            }
        });
    }

    selectOption() {

        switch (this.selected) {

        case 0:
            this.scene.start('LevelSelect');
            break;

        case 1:
            console.log('Load');
            break;

        case 2:
            console.log('Config');
            break;

        case 3:
            this.game.destroy(true);
            break;
        }
    }
}
