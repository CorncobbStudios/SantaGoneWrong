import { Boss } from './Boss.js';

// Rides the new rotation sheet (see public/sprites/lordisonokami.png) -
// 5 static facing angles, no animation frames yet, so this displays frame 0
// and just chases/contact-damages via the default Enemy behavior. Add the
// hesitant shell-swipe wind-up/stumble-recovery once the full animation
// sheet from ART_TODO.md lands.
export class LordIsonokami extends Boss {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'lordisonokami',
            health: 10,
            speed: 90,
            jumpPower: -300,
            detectionRange: 450,
            meleeRange: 80,
            attackCooldown: 1500,
            bounce: 0.1,
        });
    }
}
