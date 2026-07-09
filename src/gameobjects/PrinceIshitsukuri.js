import { Boss } from './Boss.js';

// Placeholder boss riding a static portrait (see public/sprites/prince1.png) -
// no animation frames exist yet, so this just chases and contact-damages via
// the default Enemy behavior. Swap `texture` for a real spritesheet and add
// the overhead-bowl-smash wind-up/release once art from ART_TODO.md lands.
export class PrinceIshitsukuri extends Boss {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'prince1',
            health: 10,
            speed: 110,
            jumpPower: -300,
            detectionRange: 450,
            meleeRange: 80,
            attackCooldown: 1500,
            bounce: 0.1,
        });
    }
}
