import { Scene } from 'phaser';
import { Player } from '../../gameobjects/Player.js';
import { createPlayerAnimations } from '../../utils/Animations.js';

export class GameLogic extends Scene {
    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);   
    }

    createPlayer(x, y) {
        createPlayerAnimations(this);

        this.player = new Player(this, x, y);

        this.cursors = this.input.keyboard.createCursorKeys();

        return this.player;
    }

    updatePlayer() {
        if (!this.player || !this.cursors) return;

        this.player.update(this.cursors);
    }
}