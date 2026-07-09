import * as Phaser from 'phaser';
import { createDiscSelectAnimations } from '../utils/Animations';

const CHARACTERS = [
    { key: 'kasey', label: 'KASEY' },
    { key: 'allergyboy', label: 'ALLERGY BOY' },
];

const TILE_WIDTH = 160;
const TILE_HEIGHT = 160;
const GAP_X = 40;

export class CharacterSelect extends Phaser.Scene {
    constructor() {
        super('CharacterSelect');
    }

    create() {
        createDiscSelectAnimations(this);

        this.cameras.main.setBackgroundColor('#1a1a2e');

        this.add.text(400, 60, 'SELECT CHARACTER', {
            fontFamily: 'monospace',
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const gridWidth = CHARACTERS.length * TILE_WIDTH + (CHARACTERS.length - 1) * GAP_X;
        const gridLeft = 400 - gridWidth / 2;
        const centerY = 300;

        this.menuItems = CHARACTERS.map((character, index) => {
            const x = gridLeft + index * (TILE_WIDTH + GAP_X) + TILE_WIDTH / 2;
            return this.createTile(x, centerY, character, index);
        });

        const savedCharacter = this.registry.get('character');
        const savedIndex = CHARACTERS.findIndex((c) => c.key === savedCharacter);
        this.selected = savedIndex >= 0 ? savedIndex : 0;

        this.cursorDisc = this.add.sprite(0, 0, 'discSelect');
        this.cursorDisc.play('disc_select').setScale(.65);

        this.updateSelection();

        this.input.keyboard.on('keydown-LEFT', () => this.moveSelection(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.moveSelection(1));
        this.input.keyboard.on('keydown-ENTER', () => this.selectOption());
    }

    createTile(x, y, character, index) {
        this.add.sprite(x, y - 15, character.key, 0).setScale(2);

        const border = this.add.rectangle(x, y, TILE_WIDTH, TILE_HEIGHT)
            .setStrokeStyle(3, 0xffffff);

        const label = this.add.text(x, y + TILE_HEIGHT / 2 - 16, character.label, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000aa',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5);

        border.setInteractive({ useHandCursor: true });

        border.on('pointerover', () => {
            this.selected = index;
            this.updateSelection();
        });

        border.on('pointerdown', () => {
            this.selected = index;
            this.updateSelection();
            this.selectOption();
        });

        return { label, border, x, y, character };
    }

    moveSelection(delta) {
        this.selected = (this.selected + delta + CHARACTERS.length) % CHARACTERS.length;
        this.updateSelection();
    }

    updateSelection() {
        const selectedItem = this.menuItems[this.selected];

        this.menuItems.forEach((item) => {
            const isSelected = item === selectedItem;
            item.label.setColor(isSelected ? '#85c3db' : '#ffffff');
            item.border.setStrokeStyle(3, isSelected ? 0x85c3db : 0xffffff);
        });

        this.cursorDisc.setPosition(
            selectedItem.x - TILE_WIDTH / 2 - 16,
            selectedItem.y
        );
    }

    selectOption() {
        const character = this.menuItems[this.selected].character;
        this.registry.set('character', character.key);
        this.scene.start('LevelSelect');
    }
}
