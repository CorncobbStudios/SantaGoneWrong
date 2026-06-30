import { GameLogic } from './GameLogic.js';
import { NegativeKasey } from '../../gameobjects/NegaKasey.js';
import { createEnemyAnimations } from '../../utils/Animations.js';
import TileFactory from '../../utils/TileFactory.js';


const GRASS_LEFT = 0;
const GRASS_TOP1 = 1;
const GRASS_TOP2 = 2;
const GRASS_RIGHT = 3;
const DIRT1 = 5;
const DIRT2 = 6;
const TILE_SIZE = 32;
const GROUND_Y = 600 - TILE_SIZE;


export class Level1 extends GameLogic {
    constructor() {
        super('Level1');
    }

    create() {
        this.physics.world.setBounds(0, 0, 3000, 600);
        this.cameras.main.setBounds(0, 0, 3000, 600);

        this.background = this.add.tileSprite(
            0,
            0,
            3000,
            600,
            'sky'
        );
        this.background.setOrigin(0,0);

        this.platforms = this.physics.add.staticGroup();
        this.tiles = new TileFactory(this);

        this.tiles.createTile(0, GROUND_Y, DIRT2, this.platforms);
        
        for (let x = TILE_SIZE; x < 3000 - TILE_SIZE; x += TILE_SIZE){
            this.tiles.createTile(x, GROUND_Y, DIRT1, this.platforms);
        }
        for (let x = TILE_SIZE; x < 3000 - TILE_SIZE; x += TILE_SIZE){
            this.tiles.createTile(x, GROUND_Y - 32, GRASS_TOP1, this.platforms);
        }        

        this.tiles.createTile(0, GROUND_Y - 32, GRASS_LEFT, this.platforms);


        this.createPlayer(100,450);
        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);
        createEnemyAnimations(this);

        //this.negativeKasey = new NegativeKasey(this, 600, 450);

        //this.physics.add.collider(this.negativeKasey, this.platforms);

        this.physics.add.collider(
            this.player,
            //this.negativeKasey,
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