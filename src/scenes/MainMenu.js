import * as Phaser from 'phaser';
import { createDiscSelectAnimations } from '../utils/Animations';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }


    create() {
        createDiscSelectAnimations(this);
        this.add.image(0,120, 'mainmenu')
        .setOrigin(0)
        .setScale(2.5);

        this.add.image(0, 120, 'mainmenu')
            .setOrigin(0)
            .setScale(2.5);

        this.options = [
            'START',
            'LOAD',
            'CONFIG',
            'QUIT'
        ];

        this.cursorDisc = this.add.sprite(0, 0, 'discSelect');
        this.cursorDisc = this.add.sprite('discObject', '/objects/discObject.png');
        this.cursorDisc.play('disc_select').setScale(.65);

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

            text.setInteractive({ useHandCursor: true });

            text.on('pointerover', () => {
                this.selected = index;
                this.updateSelection();
            });

            text.on('pointerdown', () => {
                this.selected = index;
                this.updateSelection();
                this.selectOption();
            });

            this.menuItems.push(text);
        });

        this.updateSelection();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-UP', () => {
            this.selected =
                (this.selected - 1 + this.options.length)
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

        this.input.keyboard.on('keydown-DOWN', () => {
            this.selected =
                (this.selected + 1)
                % this.options.length;

            this.updateSelection();
        this.input.keyboard.on('keydown-ENTER', () => {
            this.selectOption();
        });
    }


    updateSelection() {

        this.input.keyboard.on('keydown-ENTER', () => {
            this.selectOption();
        this.menuItems.forEach((item, index) => {
            item.setColor(
                index === this.selected
                    ? '#85c3db'
                    : '#ffffff'
            );
        });

        const selectedItem =
            this.menuItems[this.selected];

        this.cursorDisc.setPosition(
            selectedItem.x - 20,
            selectedItem.y + selectedItem.height / 2
        );
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


    updateSelection() {

        this.menuItems.forEach((item, index) => {
            item.setColor(
                index === this.selected
                    ? '#85c3db'
                    : '#ffffff'
            );
        });

        const selectedItem =
            this.menuItems[this.selected];

        this.cursorDisc.setPosition(
            selectedItem.x - 20,
            selectedItem.y + selectedItem.height / 2
        );
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
