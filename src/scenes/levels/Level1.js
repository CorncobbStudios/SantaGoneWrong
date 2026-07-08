import { GameLogic } from './GameLogic.js';
import { Demon } from '../../gameobjects/Demon.js';
import { Yeti } from '../../gameobjects/Yeti.js';
import { KrampusBoss } from '../../gameobjects/KrampusBoss.js';
import { Volcano } from '../../gameobjects/Volcano.js';
import { createEnemyAnimations, createVolcanoAnimations } from '../../utils/Animations.js';
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
        this.createPlatform(10, 27, 8, { thickness: 2 });
        this.createPlatform(6, 28, 2);
        this.createPlatform(6, 31, 3);
        this.createPlatform(9, 36, 3);
        this.createPlatform(5, 41, 4, { thickness: 2 });

        this.createPlayer(100, 450);
        this.createDiscGroup();
        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);

        createEnemyAnimations(this);
        createVolcanoAnimations(this);

        this.addDemon(14, 5);
        this.addYeti(24, 5);
        this.addVolcano(31, 3);

        // Boss - Level1's real end fight
        this.addBossFight(38, 5);
    }

    addDemon(x, y) {
        this.addEnemy(
            new Demon(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE)
        );
    }

    addYeti(x, y) {
        this.addEnemy(
            new Yeti(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE)
        );
    }

    addVolcano(x, y) {
        this.addEnemy(
            new Volcano(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE)
        );
    }

    addBossFight(x, y) {
        this.addBoss(
            new KrampusBoss(this, x * TILE_SIZE, GROUND_Y - y * TILE_SIZE)
        );
    }

    update() {
        this.updatePlayer();
        this.updateEnemies();
    }
}
