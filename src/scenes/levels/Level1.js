import { GameLogic } from './GameLogic.js';
import { NegativeKasey } from '../../gameobjects/NegaKasey.js';
import { createEnemyAnimations } from '../../utils/Animations.js';
import TileFactory from '../../utils/TileFactory.js';

const TILE_SIZE     = 32;
const WORLD_HEIGHT  = 600;
const WORLD_WIDTH   = TILE_SIZE * 115;
const GROUND_Y      = WORLD_HEIGHT - TILE_SIZE;
const grassTiles = [
    'GRASS_TOP1', 'GRASS_TOP2', 'GRASS_TOP3', 'GRASS_TOP4'
];

const dirtTiles = [
    'DIRT1', 'DIRT2', 'DIRT3', 'DIRT4',
    'DIRT6', 'DIRT7', 'DIRT8'
];

export class Level1 extends GameLogic {
    constructor() {
        super('Level1');
    }

    create() {
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.bg = this.add.image(0,0,'mountfuji')
        .setOrigin(0,0)
        .setScrollFactor(0.1);

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
        this.createDiscGroup();
        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);
    
        createEnemyAnimations(this);
        this.physics.add.collider(this.enemies, this.platforms);
        //this.addNegaKasey(12, -1);
        this.addNegaKasey(18, -1);
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
            const randomIndex = Math.floor(Math.random() * dirtTiles.length);
            const randomDirt = dirtTiles[randomIndex];
            let dirt = this.tiles.createTile(x, GROUND_Y, randomDirt, this.platforms);
            dirt.flipY = true;
        }

        for (let x = TILE_SIZE; x < length - TILE_SIZE; x += TILE_SIZE) {
            const randomIndex = Math.floor(Math.random() * grassTiles.length);
            const randomGrass = grassTiles[randomIndex];
            this.tiles.createTile(x, GROUND_Y - TILE_SIZE, randomGrass, this.platforms);
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
                'GRASS_TOP1',
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
