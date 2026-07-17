import * as Phaser from 'phaser';
import { Boss } from './Boss.js';

// Hand offset (relative to the boss's own x/y, before facing flip) for the
// fake stone bowl during the ishitsukuri_attack clip, indexed by the
// animation's local frame index (0-7) - eyeballed against the sheet's
// raise/overhead poses (frames 2-5, unchanged from the original attack art)
// and the redrawn spin-finish release (frames 6-7 - he now swings the bowl
// out to the side in his lead hand rather than smashing straight down, so
// this is a wide horizontal offset instead of a low/close one). Frame 7
// still has his sleeves flared out mid-motion in the art (not a calm
// recovery pose), so it keeps a real offset instead of null - hiding it
// there made the bowl vanish while he still visually looked mid-swing. Its
// offset stays out near frame 6's rather than snapping back toward center,
// since he hasn't actually pulled the bowl back in yet at this point.
// null hides the bowl only at the true calm start (frames 0-1).
const BOWL_OFFSETS = [
    null,
    { x: 14, y: -1 },
    { x: 8, y: -8 },
    { x: 2, y: -27 },
    { x: 0, y: -30 },
    { x: 0, y: -35 },
    { x: 16, y: -30 },
    { x: 16, y: -30 }
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
const IMPACT_FRAME = 7;

// How close the player needs to be to the bowl's position (not the boss's
// body) at IMPACT_FRAME to actually get hit.
const IMPACT_RANGE = 55;
// Small forward step applied on the impact frame only, so the swing reads
// as putting his weight into it rather than staying planted in place.
const IMPACT_LUNGE = 6;

// Rides the real idle/run/attack animations (see public/sprites/
// princeishitsukuri.png and Animations.js - his sheet is an 8x4 grid: idle,
// run, this attack, and a second attack in row 4 that isn't wired up to
// trigger yet). Chases until in melee range, then plays the bowl-swing
// clip. Unlike other Enemy/Boss types, merely touching him is harmless (the
// level passes addBoss a no-op onPlayerHit, see Level2.js/BossTest.js) -
// damage instead comes from a one-shot distance check against the bowl's
// own position at IMPACT_FRAME, since the boss's body hitbox alone can't
// represent a swing that reaches out past him. The bowl itself was drawn as
// its own relic icon (public/objects/buddhabowl.png), not baked into his
// frames - so a separate `bowl` sprite is puppeted into his hands
// frame-by-frame via BOWL_OFFSETS, mirroring how Player.js frame-syncs the
// disc throw.
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
                // Row 4's alternate attack - defined so the clip is ready
                // to use, but nothing triggers it yet (still deciding how/
                // when it should fire relative to the main bowl-smash).
                attack2: 'ishitsukuri_attack2',
            },
        });

        this.isAttacking = false;

        this.bowl = scene.add.sprite(x, y, 'buddhabowl');
        // buddhabowl.png is a plain 32x32 icon - too small next to a
        // 128x128-frame character, so it's scaled up to actually read as a
        // held prop rather than a tiny dot in his hand.
        this.bowl.setScale(1.5);
        // Single center pivot for the whole clip - switching between a
        // base pivot (for the raise) and a rim pivot (for the swing/
        // impact) caused a visible jump in the bowl's rendered position
        // right at the switch frame (the two pivots extend the sprite in
        // opposite directions from the anchor), independent of how well
        // BOWL_OFFSETS was tuned. Center is a compromise: no jump, but also
        // no "base leads the smash" effect.
        this.bowl.setOrigin(0.5, 0.5);
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

        // Rotation disabled for now to isolate position tuning - uncomment
        // to bring back the derived tilt.
        // const rotation = BOWL_ROTATIONS[frameIndex] ?? 0;
        // this.bowl.setRotation(rotation * facing);
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
