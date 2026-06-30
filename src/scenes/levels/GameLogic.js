import { Scene } from 'phaser';
import { Player } from '../../gameobjects/Player.js';
import { createPlayerAnimations } from '../../utils/Animations.js';
import TileFactory from '../../utils/TileFactory.js';

const GRASS_LEFT = 0;
const GRASS_TOP1 = 1;
const GRASS_TOP2 = 2;
const GRASS_RIGHT = 3;
const DIRT1 = 5;
const DIRT2 = 6;
const TILE_SIZE = 32;
const GROUND_Y = 600 - TILE_SIZE;

export class GameLogic extends Scene {
    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.enemies = [];
        this.platforms = this.physics.add.staticGroup();
        this.tiles = new TileFactory(this);
    }

    createPlayer(x, y) {
        createPlayerAnimations(this);
        this.player = new Player(this, x, y);
        this.cursors = this.input.keyboard.createCursorKeys();
        return this.player;
    }

    addEnemy(enemy, onPlayerHit) {
        this.enemies.push(enemy);
        this.physics.add.collider(enemy, this.platforms);
        this.physics.add.collider(this.player, enemy, onPlayerHit, null, this);
    }

    updatePlayer() {
        if (!this.player || !this.cursors) return;
        this.player.update(this.cursors);
    }

    updateEnemies() {
        for (var enemy of this.enemies) {
            enemy.update(this.player);
        }
    }
}
