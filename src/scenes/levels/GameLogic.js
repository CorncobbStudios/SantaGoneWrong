import * as Phaser from 'phaser';
import { Scene } from 'phaser';
import { Player } from '../../gameobjects/Player.js';
import { createPlayerAnimations } from '../../utils/Animations.js';
import { Disc } from '../../gameobjects/Disc.js';
import TileFactory from '../../utils/TileFactory.js';

const TILE_SIZE = 32;
const WORLD_HEIGHT = 600;
const WORLD_WIDTH = TILE_SIZE * 80;
const GROUND_Y = WORLD_HEIGHT - TILE_SIZE;


export class GameLogic extends Scene {
    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.enemies = [];
        this.platforms = this.physics.add.staticGroup();
        this.tiles = new TileFactory(this);
        this.discs = null;
    }

    createPlayer(x, y) {
        createPlayerAnimations(this);
        this.player = new Player(this, x, y);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        return this.player;
    }

    addEnemy(enemy, onPlayerHit) {
        this.enemies.push(enemy);
        this.physics.add.collider(enemy, this.platforms);
        this.physics.add.collider(this.player, enemy, onPlayerHit, null, this);
        this.physics.add.overlap(enemy, this.discs, this.onDiscHitEnemy, null, this);
    }

    updatePlayer() {
        if (!this.player || !this.cursors) return;
        this.player.update(this.cursors);
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)){
            this.player.throwDisc();
        }
    }

    updateEnemies() {
        for (var enemy of this.enemies) {
            enemy.update(this.player);
        }
    }

    createDisc(pos, direction) {
        const disc = new Disc(
            this,
            pos.x,
            pos.y,
            direction
        );
        this.discs.add(disc);
        disc.body.setAllowGravity(false);
  
        for (const enemy of this.enemies) {
            this.physics.add.overlap(
                disc,
                enemy,
                this.onDiscHitEnemy,
                null,
                this
            );
        }

        return disc;
    }

    createDiscGroup(){
        this.discs = this.physics.add.group();
    }

    onDiscHitEnemy(enemy, disc) {
        enemy.takeDamage(1);
        console.log(enemy.isStunned);
        disc.destroy();
    }

}
