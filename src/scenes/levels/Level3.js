import { GameLogic } from './GameLogic.js';
import { NegativeKasey } from '../../gameobjects/NegaKasey.js';
import { Demon } from '../../gameobjects/Demon.js';
import { createEnemyAnimations } from '../../utils/Animations.js';
const TILE_SIZE = 32;
const WORLD_WIDTH = TILE_SIZE * 200;
const GROUND_Y = 600 - TILE_SIZE;

export class Level3 extends GameLogic {
    constructor() {
        super('Level3');
    }

    create() {
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, 600);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 600);

        this.bg = this.add
            .image(0, 0, 'mountfuji')
            .setOrigin(0, 0)
            .setScrollFactor(0.05);

        this.createGround(WORLD_WIDTH);

        // Gauntlet opening - spaced out zigzag
        this.createPlatform(4, 7, 2);
        this.createPlatform(7, 13, 2);
        this.createPlatform(4, 19, 2);
        this.createPlatform(7, 25, 2);

        // Fortress section - spread apart
        this.createPlatform(3, 33, 8);
        this.createPlatform(6, 37, 4);
        this.createPlatform(9, 36, 2);
        this.createPlatform(6, 43, 2);

        // Bridge section
        this.createPlatform(5, 50, 10);
        this.createPlatform(8, 54, 3);
        this.createPlatform(11, 57, 2);

        // Final gauntlet - wide gaps
        this.createPlatform(4, 66, 2);
        this.createPlatform(6, 72, 2);
        this.createPlatform(8, 78, 2);
        this.createPlatform(6, 84, 2);
        this.createPlatform(4, 90, 3);
        this.createPlatform(3, 98, 5);

        this.createPlayer(100, 450);
        this.createDiscGroup();
        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);

        createEnemyAnimations(this);

        // 10 NegaKaseys - hardest level, all on platforms
        this.addNegaKasey(8, 4);
        this.addNegaKasey(14, 7);
        this.addNegaKasey(20, 4);
        this.addNegaKasey(26, 7);
        this.addNegaKasey(35, 3);
        this.addNegaKasey(38, 6);
        this.addNegaKasey(52, 5);
        this.addNegaKasey(55, 8);
        this.addNegaKasey(67, 4);
        this.addNegaKasey(85, 6);

        // Demons - fast chasers
        this.addDemon(13, 7);
        this.addDemon(36, 3);
        this.addDemon(54, 5);

        // Volcanos
        // this.addVolcano(17 * TILE_SIZE, GROUND_Y - TILE_SIZE * 2, this.hitEnemy);
        // this.addVolcano(42 * TILE_SIZE, GROUND_Y - TILE_SIZE * 2, this.hitEnemy);
        // this.addVolcano(70 * TILE_SIZE, GROUND_Y - TILE_SIZE * 2, this.hitEnemy);
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
        this.scene.start('GameOver', { level: 'Level3' });
    }
}
