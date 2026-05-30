import { AUTO, Scale } from 'phaser';
import { Boot } from './scenes/Boot.js';
import { Preloader } from './Preloader.js';
import { MainMenu } from './scenes/MainMenu.js';
import { GameOver } from './scenes/GameOver.js';
import { Level1 } from './scenes/levels/Level1.js';
import * as Phaser from 'phaser';

export const config = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },

    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },

    scene: [
        Boot,
        Preloader,
        MainMenu,
        Level1,
        GameOver
    ]
};