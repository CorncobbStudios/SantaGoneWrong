import * as Phaser from 'phaser';
import { Scene } from 'phaser';
import { Player } from '../../gameobjects/Player.js';
import { createPlayerAnimations } from '../../utils/Animations.js';
import { Disc } from '../../gameobjects/Disc.js';
import TileFactory from '../../utils/TileFactory.js';
import { HUD } from '../../ui/HUD.js';

const TILE_SIZE = 32;
const WORLD_HEIGHT = 600;
const WORLD_WIDTH = TILE_SIZE * 80;
const GROUND_Y = WORLD_HEIGHT - TILE_SIZE;


export class GameLogic extends Scene {
    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.enemies = [];
        this.platforms = this.physics.add.staticGroup();
        this.hazards = this.physics.add.staticGroup();
        this.platformRects = [];
        this.tiles = new TileFactory(this);
        this.discs = null;
        this.hud = null;
        // Set on the registry (not scene data) by CharacterSelect so the
        // choice survives GameOver's Retry/Level Select, which restart the
        // level scene without re-passing data.
        this.character = this.registry.get('character') || 'kasey';
    }

    createPlayer(x, y) {
        createPlayerAnimations(this, this.character);
        this.player = new Player(this, x, y, this.character);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.hud = new HUD(this, this.player.maxHealth);
        this.hud.setHealth(this.player.health);
        return this.player;
    }

    // Default onPlayerHit callback for addEnemy/addBoss. Damages the player,
    // refreshes the HUD, and ends the level once health hits 0 - using
    // this.scene.key means every level reports the right GameOver data
    // without needing its own hitEnemy override.
    handlePlayerHit(player, source) {
        const died = player.takeDamage(1);
        this.hud?.setHealth(player.health);
        if (died) {
            this.scene.start('GameOver', { level: this.scene.key });
        }
    }

    // Wires a source's projectile group (if it has one) to damage the player
    // on overlap. Shared by addEnemy (ranged enemies) and addBoss - anything
    // that implements getProjectileGroup().
    wireProjectiles(source, onPlayerHit) {
        const projectiles = source.getProjectileGroup?.();
        if (!projectiles) return;

        this.physics.add.overlap(this.player, projectiles, (player, projectile) => {
            projectile.destroy();
            onPlayerHit.call(this, player, projectile);
        });
    }

    addEnemy(enemy, onPlayerHit = this.handlePlayerHit) {
        this.enemies.push(enemy);
        this.physics.add.collider(enemy, this.platforms);
        this.physics.add.overlap(this.player, enemy, onPlayerHit, null, this);
        this.physics.add.overlap(enemy, this.discs, this.onDiscHitEnemy, null, this);
        this.wireProjectiles(enemy, onPlayerHit);
    }

    addBoss(boss, onPlayerHit = this.handlePlayerHit) {
        this.addEnemy(boss, onPlayerHit);
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

    createPlatform(height, start, width, options = {}) {
        const grassTiles = ['GRASS_TOP1', 'GRASS_TOP2', 'GRASS_TOP3', 'GRASS_TOP4'];
        const thickness = options.thickness ?? 1;
        const groundY = WORLD_HEIGHT - TILE_SIZE;
        const top = groundY - TILE_SIZE * height;

        for (
            let x = TILE_SIZE * start;
            x < TILE_SIZE * (start + width);
            x += TILE_SIZE
        ) {
            const topKey = options.topKey ?? grassTiles[Math.floor(Math.random() * grassTiles.length)];
            this.tiles.createTile(x, top, topKey, this.platforms);

            for (let row = 1; row < thickness; row++) {
                this.tiles.createTile(x, top + TILE_SIZE * row, 'DIRT3', this.platforms);
            }
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