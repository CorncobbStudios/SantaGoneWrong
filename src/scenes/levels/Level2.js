import { GameLogic } from './GameLogic.js';
import { Demon } from '../../gameobjects/Demon.js';
import { createEnemyAnimations } from '../../utils/Animations.js';
const TILE_SIZE = 32;
const WORLD_WIDTH = TILE_SIZE * 160;
const GROUND_Y = 600 - TILE_SIZE;

export class Level2 extends GameLogic {
    constructor() {
        super('Level2');
    }

    create() {
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, 600);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 600);

        this.bg = this.add
            .image(0, 0, 'sky')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.createGround(WORLD_WIDTH);

        // Staircase section - wide gaps between steps
        this.createPlatform(3, 8, 3);
        this.createPlatform(5, 14, 3);
        this.createPlatform(7, 20, 3);
        this.createPlatform(9, 14, 2);
        this.createPlatform(11, 8, 2);

        // Tower section - spread out
        this.createPlatform(4, 30, 6);
        this.createPlatform(7, 34, 2);
        this.createPlatform(10, 30, 2);
        this.createPlatform(13, 34, 2);

        // Scattered platforms - big horizontal gaps
        this.createPlatform(5, 44, 2);
        this.createPlatform(8, 50, 2);
        this.createPlatform(5, 56, 2);
        this.createPlatform(3, 62, 4);

        this.createPlayer(100, 450);
        this.createDiscGroup();
        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);

        createEnemyAnimations(this);

        // Demons
        this.addDemon(10, 3);
        this.addDemon(32, 4);

        // Volcanos
        // this.addVolcano(27 * TILE_SIZE, GROUND_Y - TILE_SIZE * 2, this.hitEnemy);
        // this.addVolcano(48 * TILE_SIZE, GROUND_Y - TILE_SIZE * 2, this.hitEnemy);
    }

    addDemon(x, y) {
        this.addEnemy(
            new Demon(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE)
        );
    }

    update() {
        this.updatePlayer();
        this.updateEnemies();
    }
}