import * as Phaser from 'phaser';
import { Boss } from './Boss.js';

// Hand offset (relative to the boss's own x/y, before facing flip) for the
// fake stone bowl during the ishitsukuri_attack clip, indexed by the
// animation's local frame index (0-7) - eyeballed against the sheet's
// raise/overhead/smash-down poses. null hides the bowl (calm start and
// recovery, where his hands are back down at his sides).
const BOWL_OFFSETS = [
    null,
    null,
    { x: 14, y: -16 },
    { x: 8, y: -24 },
    { x: 2, y: -42 },
    { x: 4, y: -38 },
    { x: 26, y: 46 },
    null,
];

// Rotation (radians), before facing flip - derived from BOWL_OFFSETS
// itself rather than hand-tuned separately, so the tilt can't drift out of
// sync with the hand position: it's just the angle of the hand-offset
// vector (treating the boss's own x/y as the pivot), relative to the angle
// at the first visible frame. That first frame becomes "upright" (0), and
// every later frame's tilt is exactly how far the hand position has swept
// around from there - so the bowl is guaranteed to rotate with the arms,
// not on its own separate schedule.
function computeBowlRotations(offsets) {
    const baseOffset = offsets.find((offset) => offset !== null);
    const baseAngle = Math.atan2(baseOffset.y, baseOffset.x);

    return offsets.map((offset) => (
        offset ? Math.atan2(offset.y, offset.x) - baseAngle : 0
    ));
}

const BOWL_ROTATIONS = computeBowlRotations(BOWL_OFFSETS);

// Local frame index (within ishitsukuri_attack) where the bowl actually
// lands - matches the BOWL_OFFSETS entry where it's down at impact height.
const IMPACT_FRAME = 6;
// How close the player needs to be to the bowl's position (not the boss's
// body) at IMPACT_FRAME to actually get hit.
const IMPACT_RANGE = 55;
// Small forward step applied on the impact frame only, so the swing reads
// as putting his weight into it rather than staying planted in place.
const IMPACT_LUNGE = 6;

// Rides the real idle/run/attack animations (see public/sprites/
// princeishitsukuri.png and Animations.js). Chases until in melee range,
// then plays the overhead bowl-smash clip. Unlike other Enemy/Boss types,
// merely touching him is harmless (the level passes addBoss a no-op
// onPlayerHit, see Level2.js/BossTest.js) - damage instead comes from a
// one-shot distance check against the bowl's own position at IMPACT_FRAME,
// since the boss's body hitbox alone can't represent a swing that reaches
// out past him. The bowl itself was drawn as its own relic icon
// (public/objects/buddhabowl.png), not baked into his frames - so a
// separate `bowl` sprite is puppeted into his hands frame-by-frame via
// BOWL_OFFSETS, mirroring how Player.js frame-syncs the disc throw.
export class PrinceIshitsukuri extends Boss {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'princeishitsukuri',
            health: 10,
            speed: 110,
            jumpPower: -300,
            detectionRange: 450,
            meleeRange: 80,
            attackCooldown: 1500,
            bounce: 0.1,
            // The 128x128 frame has a lot of transparent padding around him
            // (checked idle/run frames: his silhouette actually spans
            // roughly x:27-93, y:3-125) - Enemy's generic 0.6/0.7-of-frame
            // default missed his head/hat entirely, so this is sized to the
            // real art instead.
            bodySize: { width: 66, height: 122 },
            bodyOffset: { x: 27, y: 4 },
            animations: {
                idle: 'ishitsukuri_idle',
                run: 'ishitsukuri_run',
                attack: 'ishitsukuri_attack',
            },
        });

        this.isAttacking = false;

        this.bowl = scene.add.sprite(x, y, 'buddhabowl');
        // Pivot on the bowl's base (checked buddhabowl.png: its content sits
        // at roughly y:7-26 of the 32px canvas, so the base is ~81% down),
        // not its center - so it rotates like it's resting in his hands
        // (base stays put, rim/top tips), instead of spinning in place.
        this.bowl.setOrigin(0.5, 0.81);
        this.bowl.setVisible(false);

        this.on('animationupdate', (anim, frame) => {
            if (anim.key !== this.animations.attack) return;

            if (frame.index === IMPACT_FRAME) {
                const facing = this.flipX ? -1 : 1;
                this.x += facing * IMPACT_LUNGE;
            }

            this.positionBowl(frame.index);
            if (frame.index === IMPACT_FRAME) this.tryImpactHit();
        });

        this.on(`animationcomplete-${this.animations.attack}`, () => {
            this.isAttacking = false;
            this.bowl.setVisible(false);
        });
    }

    positionBowl(frameIndex) {
        const offset = BOWL_OFFSETS[frameIndex];
        if (!offset) {
            this.bowl.setVisible(false);
            return;
        }

        const facing = this.flipX ? -1 : 1;
        this.bowl.setPosition(this.x + offset.x * facing, this.y + offset.y);
        // Mirroring a sprite horizontally flips the sense of its rotation
        // too (a clockwise lean, viewed in a mirror, reads as counter-
        // clockwise) - BOWL_ROTATIONS is tuned against his base/unflipped
        // frames (leaning away from his reach on the raise, diving into it
        // on the swing down), so this needs the same facing flip as the
        // position offset to stay consistent once he's mirrored to face
        // the other way.
        this.bowl.setRotation((BOWL_ROTATIONS[frameIndex] ?? 0) * facing);
        this.bowl.setVisible(true);
    }

    tryImpactHit() {
        const player = this.scene.player;
        if (!player) return;

        const distance = Phaser.Math.Distance.Between(this.bowl.x, this.bowl.y, player.x, player.y);
        if (distance <= IMPACT_RANGE) {
            // Only shake/punch the camera on an actual connect, not every
            // whiffed swing.
            this.scene.cameras.main.shake(90, 0.005);
            this.scene.handlePlayerHit(player, this);
        }
    }

    decideMovement(player, onGround) {
        if (this.isAttacking) {
            this.setVelocityX(0);
            return;
        }

        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        // Once he's in range, stop closing the gap entirely - chasePlayer
        // has no stopping distance, so left unchecked he'd keep pushing in
        // until he's standing on top of the player instead of just staying
        // at melee reach. Still needs to face the player while planted here
        // (facing drives the bowl's mirrored offset/rotation), which
        // chasePlayer would otherwise be the one handling.
        if (distance <= this.meleeRange) {
            this.setVelocityX(0);
            const goingLeft = player.x < this.x;
            this.setFlipX(this.facesLeft ? !goingLeft : goingLeft);
            if (onGround) this.playAnimation(this.animations?.idle);

            if (this.canAttack) this.attack();
            return;
        }

        if (distance < this.detectionRange) {
            this.chasePlayer(player, onGround);
        } else {
            this.idle(onGround);
        }
    }

    attack() {
        this.isAttacking = true;
        this.canAttack = false;
        this.setVelocityX(0);
        this.playAnimation(this.animations.attack);

        this.scene.time.delayedCall(this.attackCooldown, () => {
            if (this.active) this.canAttack = true;
        });
    }

    // A hit mid-swing cancels the attack rather than leaving isAttacking
    // stuck true forever - stun() (called from takeDamage) switches the
    // animation to idle without ever firing the attack clip's
    // animationcomplete event, which is what normally clears this.
    stun(duration) {
        this.isAttacking = false;
        this.bowl.setVisible(false);
        super.stun(duration);
    }

    die() {
        this.bowl.destroy();
        super.die();
    }
}
