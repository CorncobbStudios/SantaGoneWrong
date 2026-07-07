import { Enemy } from './Enemy.js';

export class Demon extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'demon',
            health: 2,
            speed: 200,
            jumpPower: -320,
            detectionRange: 500,
            moveDelay: 500,
            bounce: 0.1,
            facesLeft: true,
            animations: {
                idle: 'demon_idle',
                run: 'demon_run',
                jump: 'demon_jump',
                fall: 'demon_fall',
            },
        });
    }
}