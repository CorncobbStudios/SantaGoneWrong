import Phaser from 'phaser';
import { config } from './config.js';
import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { MainMenu } from './scenes/MainMenu.js';
import { GameOver } from './scenes/GameOver.js';
import { Level1 } from './scenes/levels/Level1.js';

new Phaser.Game(config);