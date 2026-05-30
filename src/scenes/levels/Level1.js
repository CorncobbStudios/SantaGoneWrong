import { GameLogic } from './GameLogic.js';
import { NegativeKasey } from '../../gameobjects/NegaKasey.js';
import { createEnemyAnimations } from '../../utils/animations.js';

export class Level1 extends GameLogic {
    constructor() {
        super('Level1');
    }
    create() {
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.createPlayer(100,450);

        this.physics.add.collider(this.player, this.platforms);
        createEnemyAnimations(this);

        this.negativeKasey = new NegativeKasey(this, 600, 450);

        this.physics.add.collider(this.negativeKasey, this.platforms);

        this.physics.add.collider(
            this.player,
            this.negativeKasey,
            this.hitEnemy,
            null,
            this
        );

    }

    update() {
        this.updatePlayer();

        if (this.negativeKasey) {
            this.negativeKasey.update(this.player);
        }
    }
    hitEnemy(player, enemy) {
        this.scene.start('GameOver');
    }     
} 