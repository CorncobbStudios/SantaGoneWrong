import * as Phaser from 'phaser';
import { Scene } from 'phaser';
import { Player } from '../../gameobjects/Player.js';
import { createPlayerAnimations } from '../../utils/Animations.js';
import { Disc } from '../../gameobjects/Disc.js';
import { Volcano } from '../../gameobjects/Volcano.js';
import TileFactory from '../../utils/TileFactory.js';

const TILE_SIZE = 32;
const WORLD_HEIGHT = 600;
const WORLD_WIDTH = TILE_SIZE * 80;
const GROUND_Y = WORLD_HEIGHT - TILE_SIZE;


export class GameLogic extends Scene {
    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.enemies = [];
        this.volcanos = [];
        this.platforms = this.physics.add.staticGroup();
        this.platformRects = [];
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
        this.physics.add.overlap(this.player, enemy, onPlayerHit, null, this);
        this.physics.add.overlap(enemy, this.discs, this.onDiscHitEnemy, null, this);
    }

    addBoss(boss, onPlayerHit) {
        this.addEnemy(boss, onPlayerHit);

        const projectiles = boss.getProjectileGroup();
        if (projectiles) {
            this.physics.add.overlap(this.player, projectiles, (player, projectile) => {
                projectile.destroy();
                onPlayerHit.call(this, player, projectile);
            });
        }
    }

    updatePlayer() {
        if (!this.player || !this.cursors) return;
        this.player.update(this.cursors);
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)){
            this.player.throwDisc();
        }
    }

    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => enemy.active);
        for (const enemy of this.enemies) {
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
        disc.body.setVelocity(direction * 900, 0);

        return disc;
    }

    createDiscGroup(){
        this.discs = this.physics.add.group();
    }

    createPlatform(height, start, width) {
        const groundY = WORLD_HEIGHT - TILE_SIZE;
        const top = groundY - TILE_SIZE * height;

        for (
            let x = TILE_SIZE * start;
            x < TILE_SIZE * (start + width);
            x += TILE_SIZE
        ) {
            this.tiles.createTile(
                x,
                top,
                'GRASS_TOP1',
                this.platforms
            );
        }

        this.platformRects.push({
            left: TILE_SIZE * start,
            right: TILE_SIZE * (start + width),
            top,
        });
    }

    // Returns the bounding box of the platform whose top surface is at
    // (x, y), or null if it's the main ground (not tracked here) or
    // between platforms. Lets enemies navigate to a real edge instead of
    // guessing blindly. y should be a feet/bottom position (e.g.
    // entity.body.bottom), not a sprite's center - a standing entity's
    // feet sit right at rect.top, within a small tolerance for physics
    // settling.
    getPlatformAt(x, y) {
        const TOLERANCE = 8;

        return this.platformRects.find(
            (rect) => x >= rect.left && x <= rect.right && Math.abs(rect.top - y) <= TOLERANCE
        ) ?? null;
    }

    createGround(length) {
        const grassTiles = ['GRASS_TOP1', 'GRASS_TOP2', 'GRASS_TOP3', 'GRASS_TOP4'];
        const dirtTiles = ['DIRT1', 'DIRT2', 'DIRT3', 'DIRT4', 'DIRT6', 'DIRT7', 'DIRT8'];
        const groundY = WORLD_HEIGHT - TILE_SIZE;

        // Visual-only tiles (no physics bodies)
        for (let x = TILE_SIZE; x < length - TILE_SIZE; x += TILE_SIZE) {
            const dirt = this.tiles.createVisualTile(x, groundY, dirtTiles[Math.floor(Math.random() * dirtTiles.length)]);
            dirt.flipY = true;
        }
        for (let x = TILE_SIZE; x < length - TILE_SIZE; x += TILE_SIZE) {
            this.tiles.createVisualTile(x, groundY - TILE_SIZE, grassTiles[Math.floor(Math.random() * grassTiles.length)]);
        }

        // Single static collision body for the entire ground
        const groundBody = this.add.zone(TILE_SIZE, groundY - TILE_SIZE, length - TILE_SIZE * 2, TILE_SIZE * 2);
        groundBody.setOrigin(0, 0);
        this.physics.add.existing(groundBody, true);
        this.platforms.add(groundBody);
    }

    onDiscHitEnemy(enemy, disc) {
        enemy.takeDamage(1);
        disc.destroy();
    }

}