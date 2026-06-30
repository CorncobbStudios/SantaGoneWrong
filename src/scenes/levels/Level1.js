import { GameLogic } from './GameLogic.js';
import { NegativeKasey } from '../../gameobjects/NegaKasey.js';
import { createEnemyAnimations } from '../../utils/Animations.js';
import TileFactory from '../../utils/TileFactory.js';

const TILE_SIZE = 32;
const WORLD_HEIGHT = 600;
const WORLD_WIDTH = TILE_SIZE * 80;
const GROUND_Y = WORLD_HEIGHT - TILE_SIZE;
const GRASS_LEFT = 0;
const GRASS_TOP1 = 1;
const GRASS_TOP2 = 2;
const GRASS_RIGHT = 3;
const DIRT1 = 5;
const DIRT2 = 6;


export class Level1 extends GameLogic {
    constructor() {
        super('Level1');
    }

    create() {
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'sky');
        this.background.setOrigin(0, 0);

        this.createGround(WORLD_WIDTH);
        this.createPlatform(5, 10, 5);
        this.createPlatform(7, 17, 1);
        this.createPlatform(4, 21, 4);
        this.createPlatform(10, 27, 8);
        this.createPlatform(6, 28, 2);
        this.createPlatform(6, 31, 3);
        this.createPlatform(6, 31, 3);

        //this.tiles.createTile(0, GROUND_Y - 32, GRASS_LEFT, this.platforms);

        this.createPlayer(100, 450);
        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);
        createEnemyAnimations(this);

        this.addNegaKasey(12, -1);
        this.addNegaKasey(18, -1);
        this.addNegaKasey(22, 0);
        this.addNegaKasey(28, 10);
        this.addNegaKasey(30, 0);
        this.addNegaKasey(-3, 10);
    }

    addNegaKasey(x, y) {
        this.addEnemy(
            new NegativeKasey(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE),
            this.hitEnemy,
        );
    }

    createGround(length) {
        for (let x = TILE_SIZE; x < length-TILE_SIZE; x += TILE_SIZE) {
            this.tiles.createTile(x, GROUND_Y, DIRT1, this.platforms);
        }
        for (let x = TILE_SIZE; x < length-TILE_SIZE; x += TILE_SIZE) {
            this.tiles.createTile(x, GROUND_Y - TILE_SIZE, GRASS_TOP1, this.platforms);
        }
        // creating the firt and last tile of the ground
        this.tiles.createTile(0, GROUND_Y, DIRT1, this.platforms);
        this.tiles.createTile(0, GROUND_Y - TILE_SIZE, GRASS_LEFT, this.platforms);
        this.tiles.createTile(length-TILE_SIZE, GROUND_Y, DIRT1, this.platforms);
        this.tiles.createTile(length-TILE_SIZE, GROUND_Y - TILE_SIZE, GRASS_RIGHT, this.platforms);
    }

    createPlatform(height, start, width) {
        for (
            let x = TILE_SIZE * start;
            x < TILE_SIZE * (start + width);
            x += TILE_SIZE
        ) {
            this.tiles.createTile(
                x,
                GROUND_Y - TILE_SIZE * height,
                GRASS_TOP2,
                this.platforms,
            );
        }
    }

    update() {
        this.updatePlayer();
        this.updateEnemies();
    }
    hitEnemy(player, enemy) {
        this.scene.start('GameOver');
    }
}
