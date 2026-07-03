import { Enemy } from './Enemy.js';

export class NegativeKasey extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'nk',
            health: 3,
            speed: 120,
            jumpPower: -280,
            detectionRange: 500,
            moveDelay: 500,
            stunDuration: 500,
            bounce: 0.1,
            bodySize: { width: 34, height: 50 },
            bodyOffset: { x: 15, y: 8 },
            animations: {
                idle: 'negative_idle',
                run: 'negative_run',
                jump: 'negative_jump',
                fall: 'negative_fall',
            },
        });
    }
}
