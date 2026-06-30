import { Scene } from 'phaser';
import { Player } from '../../gameobjects/Player.js';
import { createPlayerAnimations } from '../../utils/Animations.js';
import TileFactory from '../../utils/TileFactory.js';

const TILE_SIZE = 32;
const WORLD_HEIGHT = 600;
const WORLD_WIDTH = TILE_SIZE * 80;
const GROUND_Y = WORLD_HEIGHT - TILE_SIZE;
const GRASS_TOP1 = 0; 
const DIRT1 = 1;
const GRASS_EDGE1 = 2;
const DIRT2 = 3;
const GRASS_TOP2 = 4;
const DIRT3 = 5;
const GRASS_LEFT = 6;
const DIRT4 = 7;
const GRASS_TOP3 = 8;
const DIRT5 = 9;
const GRASS_RIGHT = 10;
const DIRT6 = 11;
const GRASS_TOP4 = 12;
const DIRT7 = 13;
const GRASS_RIGHT2 = 14;
const DIRT8 = 15;

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
