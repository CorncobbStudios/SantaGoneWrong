import * as Phaser from 'phaser';
import { createDiscSelectAnimations } from '../utils/Animations';

const TOTAL_LEVELS = 10;
const COLUMNS = 5;
const TILE_WIDTH = 130;
const TILE_HEIGHT = 90;
const GAP_X = 14;
const GAP_Y = 18;

const LEVEL_PREVIEWS = {
    Level1: 'mountfuji',
    Level2: 'sky',
    Level3: 'mountfuji'
};

export class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        createDiscSelectAnimations(this);

        this.cameras.main.setBackgroundColor('#1a1a2e');

        this.add.text(400, 45, 'SELECT LEVEL', {
            fontFamily: 'monospace',
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.rows = Math.ceil(TOTAL_LEVELS / COLUMNS);

        this.levels = [];
        for (let i = 1; i <= TOTAL_LEVELS; i++) {
            const sceneKey = `Level${i}`;
            this.levels.push({
                label: `LEVEL ${i}`,
                scene: sceneKey,
                preview: LEVEL_PREVIEWS[sceneKey] ?? null,
                locked: !this.scene.get(sceneKey)
            });
        }

        const gridWidth = COLUMNS * TILE_WIDTH + (COLUMNS - 1) * GAP_X;
        const gridLeft = 400 - gridWidth / 2;
        const gridTop = 100;

        this.menuItems = [];

        this.levels.forEach((level, index) => {
            const col = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);
            const x = gridLeft + col * (TILE_WIDTH + GAP_X) + TILE_WIDTH / 2;
            const y = gridTop + row * (TILE_HEIGHT + GAP_Y) + TILE_HEIGHT / 2;

            this.menuItems.push(this.createTile(x, y, level, index));
        });

        const backY = gridTop + this.rows * (TILE_HEIGHT + GAP_Y) + TILE_HEIGHT / 2 + 20;
        const backOption = { label: 'BACK', scene: 'MainMenu', preview: 'mainmenu', locked: false };
        this.backItem = this.createTile(400, backY, backOption, TOTAL_LEVELS);

        this.selected = 0;

        this.cursorDisc = this.add.sprite(0, 0, 'discSelect');
        this.cursorDisc.play('disc_select').setScale(.65);

        this.updateSelection();

        this.input.keyboard.on('keydown-LEFT', () => this.moveSelection(-1, 0));
        this.input.keyboard.on('keydown-RIGHT', () => this.moveSelection(1, 0));
        this.input.keyboard.on('keydown-UP', () => this.moveSelection(0, -1));
        this.input.keyboard.on('keydown-DOWN', () => this.moveSelection(0, 1));

        this.input.keyboard.on('keydown-ENTER', () => {
            this.selectOption();
        });
    }

    createTile(x, y, option, index) {
        if (option.preview) {
            this.add.image(x, y, option.preview)
                .setDisplaySize(TILE_WIDTH, TILE_HEIGHT)
                .setOrigin(0.5);
        }

        const border = this.add.rectangle(x, y, TILE_WIDTH, TILE_HEIGHT)
            .setStrokeStyle(3, option.locked ? 0x555555 : 0xffffff)
            .setFillStyle(0x000000, option.preview ? 0 : 0.4);

        const label = this.add.text(x, y + TILE_HEIGHT / 2 - 16, option.locked ? 'LOCKED' : option.label, {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: option.locked ? '#555555' : '#ffffff',
            backgroundColor: '#000000aa',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5);

        if (!option.locked) {
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
        }

        return { label, border, x, y, option };
    }

    moveSelection(dCol, dRow) {
        const isBack = this.selected === TOTAL_LEVELS;
        let col = isBack ? 0 : this.selected % COLUMNS;
        let row = isBack ? this.rows : Math.floor(this.selected / COLUMNS);

        if (dCol !== 0 && !isBack) {
            col = (col + dCol + COLUMNS) % COLUMNS;
        }

        if (dRow !== 0) {
            const totalRows = this.rows + 1;
            row = (row + dRow + totalRows) % totalRows;
        }

        this.selected = row === this.rows ? TOTAL_LEVELS : row * COLUMNS + col;
        this.updateSelection();
    }

    getSelectedItem() {
        return this.selected === TOTAL_LEVELS ? this.backItem : this.menuItems[this.selected];
    }

    updateSelection() {
        const selectedItem = this.getSelectedItem();

        [...this.menuItems, this.backItem].forEach((item) => {
            const isSelected = item === selectedItem;
            const isLocked = item.option.locked;
            item.label.setColor(isLocked ? '#555555' : (isSelected ? '#85c3db' : '#ffffff'));
            item.border.setStrokeStyle(3, isLocked ? 0x555555 : (isSelected ? 0x85c3db : 0xffffff));
        });

        this.cursorDisc.setPosition(
            selectedItem.x - TILE_WIDTH / 2 - 16,
            selectedItem.y
        );
    }

    selectOption() {
        const item = this.getSelectedItem();
        if (item.option.locked) return;
        this.scene.start(item.option.scene);
    }
}