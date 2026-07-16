import { Boss } from './Boss.js';

// Rides the new rotation sheet (see public/sprites/ministerabe.png) -
// 5 static facing angles, no animation frames yet, so this displays frame 0
// and just chases/contact-damages via the default Enemy behavior. Add the
// robe-whip fire crack + beat-out-the-flames recovery once the full
// animation sheet from ART_TODO.md lands.
export class MinisterAbe extends Boss {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'ministerabe',
            health: 10,
            speed: 120,
            jumpPower: -300,
            detectionRange: 450,
            meleeRange: 80,
            attackCooldown: 1500,
            bounce: 0.1,
        });
    }
}
