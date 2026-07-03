import { GameLogic } from './GameLogic.js';
import { NegativeKasey } from '../../gameobjects/NegaKasey.js';
import { Demon } from '../../gameobjects/Demon.js';
import { createEnemyAnimations } from '../../utils/Animations.js';
const TILE_SIZE = 32;
const WORLD_WIDTH = TILE_SIZE * 115;
const GROUND_Y = 600 - TILE_SIZE;

export class Level1 extends GameLogic {
    constructor() {
        super('Level1');
    }

    create() {
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, 600);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 600);

        this.bg = this.add
            .image(0, 0, 'mountfuji')
            .setOrigin(0, 0)
            .setScrollFactor(0.1);

        this.createGround(WORLD_WIDTH);
        this.createPlatform(5, 10, 5);
        this.createPlatform(7, 17, 1);
        this.createPlatform(4, 21, 4);
        this.createPlatform(10, 27, 8);
        this.createPlatform(6, 28, 2);
        this.createPlatform(6, 31, 3);
        this.createPlatform(6, 31, 3);

        this.createPlayer(100, 450);
        this.createDiscGroup();
        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);

        createEnemyAnimations(this);
        this.addNegaKasey(11, 5);
        this.addNegaKasey(17, 7);
        this.addNegaKasey(22, 4);
        this.addNegaKasey(28, 10);
        this.addNegaKasey(29, 6);
        this.addNegaKasey(32, 6);

        // Demons - fast chasers
        this.addDemon(14, 5);

        // Volcano
        // this.addVolcano(25 * TILE_SIZE, GROUND_Y - TILE_SIZE * 2, this.hitEnemy);
    }

    addNegaKasey(x, y) {
        this.addEnemy(
            new NegativeKasey(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE),
            this.hitEnemy
        );
    }

    addDemon(x, y) {
        this.addEnemy(
            new Demon(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE),
            this.hitEnemy
        );
    }

    update() {
        this.updatePlayer();
        this.updateEnemies();
    }
    hitEnemy(player, enemy) {
        this.scene.start('GameOver', { level: 'Level1' });
    }
}
