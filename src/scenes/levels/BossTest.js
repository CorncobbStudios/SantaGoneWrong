import { GameLogic } from './GameLogic.js';
import { PrinceIshitsukuri } from '../../gameobjects/PrinceIshitsukuri.js';
import { PrinceKuramochi } from '../../gameobjects/PrinceKuramochi.js';
import { MinisterOtomo } from '../../gameobjects/MinisterOtomo.js';
import { LordIsonokami } from '../../gameobjects/LordIsonokami.js';
import { MinisterAbe } from '../../gameobjects/MinisterAbe.js';
import { createEnemyAnimations } from '../../utils/Animations.js';

const TILE_SIZE = 32;
const WORLD_WIDTH = TILE_SIZE * 120;
const GROUND_Y = 600 - TILE_SIZE;

// Dev-only sandbox for eyeballing boss animation/attack timing in isolation
// - flat ground, no other enemies/hazards. All 5 prince/minister bosses are
// spaced out along the ground so you can walk from one to the next; press R
// to restart the scene (fresh cooldowns) without leaving the level, or I to
// toggle player invulnerability (starts on, so a bad hitbox or a runaway
// attack loop doesn't send you back to the menus, but toggle it off when
// you actually want to feel a hit land).
export class BossTest extends GameLogic {
    constructor() {
        super('BossTest');
    }

    create() {
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, 600);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 600);

        this.bg = this.add
            .image(0, 0, 'sky')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.createGround(WORLD_WIDTH);

        this.createPlayer(100, 450);
        this.createDiscGroup();
        this.cameras.main.startFollow(this.player);
        this.physics.add.collider(this.player, this.platforms);

        this.player.invulnerable = true;

        this.invulnerableText = this.add.text(16, 48, '', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000aa',
            padding: { x: 4, y: 2 },
        }).setScrollFactor(0).setDepth(1000);
        this.updateInvulnerableText();

        createEnemyAnimations(this);

        this.addPrinceIshitsukuri(15);
        this.addBossAt(PrinceKuramochi, 35);
        this.addBossAt(MinisterOtomo, 55);
        this.addBossAt(LordIsonokami, 75);
        this.addBossAt(MinisterAbe, 95);

        this.input.keyboard.on('keydown-R', () => this.scene.restart());
        this.input.keyboard.on('keydown-I', () => {
            this.player.invulnerable = !this.player.invulnerable;
            this.updateInvulnerableText();
        });
    }

    updateInvulnerableText() {
        const state = this.player.invulnerable ? 'ON' : 'OFF';
        this.invulnerableText.setText(`INVULNERABLE: ${state}  (I to toggle, R to restart)`);
    }

    addBossAt(BossClass, tileX) {
        this.addBoss(new BossClass(this, tileX * TILE_SIZE, GROUND_Y));
    }

    // Mirrors Level2.js's addPrinceIshitsukuri - contact alone never damages
    // the player; PrinceIshitsukuri does its own impact-frame/bowl-distance
    // check instead (see PrinceIshitsukuri.js), so this is a no-op instead
    // of the addBossAt/addBoss default (this.handlePlayerHit).
    addPrinceIshitsukuri(tileX) {
        const boss = new PrinceIshitsukuri(this, tileX * TILE_SIZE, GROUND_Y);
        this.addBoss(boss, () => {});
    }

    update() {
        this.updatePlayer();
        this.updateEnemies();
    }
}
