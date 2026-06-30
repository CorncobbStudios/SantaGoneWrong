import { GameLogic } from './GameLogic.js';
import { NegativeKasey } from '../../gameobjects/NegaKasey.js';
import { createEnemyAnimations } from '../../utils/Animations.js';
import TileFactory from '../../utils/TileFactory.js';

const TILE_SIZE     = 32;
const WORLD_HEIGHT  = 600;
const WORLD_WIDTH   = TILE_SIZE * 80;
const GROUND_Y      = WORLD_HEIGHT - TILE_SIZE;
const tiles_grass = {};
tiles_grass.GRASS_TOP1 = 0; 
tiles_grass.GRASS_TOP2 = 4;
tiles_grass.GRASS_TOP3 = 8;
tiles_grass.GRASS_TOP4 = 12;
const tiles_dirt = {};
tiles_dirt.DIRT1 = 1;
tiles_dirt.DIRT2 = 3;
tiles_dirt.DIRT3 = 5;
tiles_dirt.DIRT4 = 7;
tiles_dirt.DIRT6 = 11;
tiles_dirt.DIRT7 = 13;
tiles_dirt.DIRT8 = 15;


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

        //this.addNegaKasey(12, -1);
        //this.addNegaKasey(18, -1);
        //this.addNegaKasey(22, 0);
        //this.addNegaKasey(28, 10);
        //this.addNegaKasey(30, 0);
        //this.addNegaKasey(-3, 10);
    }

    addNegaKasey(x, y) {
        this.addEnemy(
            new NegativeKasey(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE),
            this.hitEnemy,
        );
    }

    createGround(length) {
        for (let x = TILE_SIZE; x < length-TILE_SIZE; x += TILE_SIZE) {
            let keys = Object.keys(tiles_dirt);
            const random_index = Math.floor(Math.random() * keys.length);
            const random_key = keys[random_index];
            let random_tile = tiles_dirt[random_key];
            let dirt = this.tiles.createTile(x, GROUND_Y, random_tile, this.platforms);
            dirt.flipY = true;
        }
        for (let x = TILE_SIZE; x < length - TILE_SIZE; x += TILE_SIZE) {
            let keys = Object.keys(tiles_grass);
            const random_index = Math.floor(Math.random() * keys.length);
            const random_key = keys[random_index];
            let random_tile = tiles_grass[random_key];
            this.tiles.createTile(x, GROUND_Y - TILE_SIZE, random_tile, this.platforms);
        }
        // creating the firt and last tile of the ground


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
                tiles_grass.GRASS_TOP2,
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
