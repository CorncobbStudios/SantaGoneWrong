import { AUTO, Scale } from 'phaser';
import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { MainMenu } from './scenes/MainMenu.js';
import { GameOver } from './scenes/GameOver.js';
import { Victory } from './scenes/Victory.js';
import { CharacterSelect } from './scenes/CharacterSelect.js';
import { LevelSelect } from './scenes/LevelSelect.js';
import { Level1 } from './scenes/levels/Level1.js';
import { Level2 } from './scenes/levels/Level2.js';
import { Level3 } from './scenes/levels/Level3.js';
import { BossTest } from './scenes/levels/BossTest.js';
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
            debug: true
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
        CharacterSelect,
        LevelSelect,
        Level1,
        Level2,
        Level3,
        BossTest,
        GameOver,
        Victory
    ]
};