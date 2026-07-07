import * as Phaser from 'phaser';
import { Boss } from './Boss.js';
import { Disc } from './Disc.js';

const DISC_SPEED = 650;
// negative_throw is 6 frames at 10fps (see Animations.js). Frame 4 is
// where the player's own throw animation releases its disc (Player.js),
// so mirror that here instead of spawning the disc the instant the
// animation starts.
const THROW_RELEASE_FRAME = 4;
const THROW_FRAME_RATE = 10;
const THROW_RELEASE_DELAY = (THROW_RELEASE_FRAME / THROW_FRAME_RATE) * 1000;
const BURST_GAP = THROW_RELEASE_DELAY + 50;
const LEAP_COOLDOWN = 1800;
const DODGE_COOLDOWN = 600;
const DODGE_RANGE_X = 120;
const DODGE_RANGE_Y = 40;
const THROW_ALIGNMENT_Y = 50;
const CHASE_DEAD_ZONE = 60;
// How far past a platform's edge to stand before jumping, and how close
// counts as "arrived" at that spot.
const EDGE_MARGIN = 60;
const EDGE_TOLERANCE = 12;
// How long after the vertical launch to push sideways into the platform.
const HORIZONTAL_PUSH_DELAY = 350;
// Scene gravity is 300 (config.js). Max jump height is v^2/(2*gravity), so
// the normal combat jumpPower (-300) only reaches ~150px - below almost
// every platform in Level1 (128-320px). Climbing needs its own stronger
// launch; the regular jumpPower stays as-is for chasing/dodging.
const CLIMB_JUMP_POWER = -330;

export class NegativeKaseyBoss extends Boss {
    constructor(scene, x, y) {
        super(scene, x, y, {
            texture: 'nk',
            health: 20,
            speed: 150,
            jumpPower: -300,
            detectionRange: 600,
            meleeRange: 90,
            attackCooldown: 900,
            moveDelay: 200,
            stunDuration: 400,
            bounce: 0.1,
            bodySize: { width: 34, height: 50 },
            bodyOffset: { x: 15, y: 8 },
            animations: {
                idle: 'negative_idle',
                run: 'negative_run',
                jump: 'negative_jump',
                fall: 'negative_fall',
                throw: 'negative_throw',
            },
        });

        this.maxHealth = this.health;
        this.baseSpeed = this.speed;
        this.baseAttackCooldown = this.attackCooldown;

        this.discGroup = scene.physics.add.group();
        this.isThrowingAnim = false;
        this.canLeap = true;
        this.canDodge = true;
        this.pendingThrowDirection = null;
        this.landing = null;

        this.on('animationupdate', (anim, frame) => {
            if (anim.key === this.animations.throw && frame.index === THROW_RELEASE_FRAME) {
                this.releaseDisc(this.pendingThrowDirection);
            }
        });

        this.on('animationcomplete-negative_throw', () => {
            this.isThrowingAnim = false;
            this.playAnimation(this.animations?.idle);
        });
    }

    // Phase is derived live from remaining health so it can never desync
    // from a stored value: 1 = full strength, 2 = wounded (>34%-66%),
    // 3 = enrage (<=34%).
    getPhase() {
        const ratio = this.health / this.maxHealth;
        if (ratio <= 0.34) return 3;
        if (ratio <= 0.66) return 2;
        return 1;
    }

    getSpeedMultiplier() {
        switch (this.getPhase()) {
            case 3: return 1.4;
            case 2: return 1.2;
            default: return 1;
        }
    }

    getAttackCooldown() {
        switch (this.getPhase()) {
            // No burst in phase 3 (leap-throw is its aggression instead),
            // so cooldown just needs to clear one wind-up.
            case 3: return 450;
            // Burst-fires twice (see throwDisc), so cooldown must cover
            // both wind-ups or the next cycle would cut the burst short.
            case 2: return 950;
            default: return this.baseAttackCooldown;
        }
    }

    decideMovement(player, onGround) {
        this.speed = this.baseSpeed * this.getSpeedMultiplier();

        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distance >= this.detectionRange) {
            this.idle(onGround);
            return;
        }

        this.checkDodge(onGround);

        // A platform-climb jump is committed once launched (this.landing is
        // set): CLIMB_JUMP_POWER is strong enough that the boss can rise
        // past the player's y level mid-arc well before it's horizontally
        // over the platform. If that happens, the plain alignment check
        // below would call it "aligned" and hand control to rangedAttack/
        // chaseTowardPlayer, which set their own velocityX every frame and
        // cancel the climb's horizontal push before it ever lands. Keep
        // routing to approachPlatform until the climb actually resolves.
        if (this.landing && !onGround) {
            this.approachPlatform(player, onGround);
            return;
        }

        // Vertical alignment is checked before meleeRange: raw diagonal
        // distance can fall inside meleeRange for a player standing on a
        // low platform even though they're not on the same level, which
        // would otherwise skip straight to chaseTowardPlayer's dumb
        // straight-up jump instead of actually climbing up to them.
        if (Math.abs(player.y - this.y) > THROW_ALIGNMENT_Y) {
            this.approachPlatform(player, onGround);
            return;
        }

        if (distance <= this.meleeRange) {
            this.chaseTowardPlayer(player, onGround);
            return;
        }

        const horizontalDistance = Math.abs(player.x - this.x);

        if (onGround && this.getPhase() === 3 && this.canLeap && this.canAttack) {
            this.leapThrow(player);
            return;
        }

        this.rangedAttack(player, horizontalDistance, onGround);
    }

    // Enemy.chasePlayer has no horizontal dead zone, so once the boss gets
    // near the player's x position it flip-flops direction by a few pixels
    // forever instead of settling. This adds a dead zone so it commits to
    // a direction and settles once close enough, while still jumping to
    // climb toward the player.
    chaseTowardPlayer(player, onGround) {
        const dx = player.x - this.x;

        if (Math.abs(dx) > CHASE_DEAD_ZONE) {
            this.moveTowards(dx < 0);
        } else {
            this.setVelocityX(0);
        }

        if (onGround) {
            const isMoving = this.body.velocity.x !== 0;
            this.playAnimation(isMoving ? this.animations?.run : this.animations?.idle);
        }

        const playerIsAbove = player.y < this.y - 40;
        const blockedByWall = this.body.blocked.left || this.body.blocked.right;

        if (onGround && (playerIsAbove || blockedByWall)) {
            this.jump();
        }
    }

    // Uses the level's real platform geometry (GameLogic.getPlatformAt) to
    // walk to whichever edge of the player's platform is closer, then
    // jumps toward the platform's interior so momentum carries it over the
    // lip and onto the top - instead of blindly guessing a direction and
    // hoping a straight-up jump connects.
    approachPlatform(player, onGround) {
        // getPlatformAt matches against the platform's top surface, so it
        // needs the player's feet position, not their sprite-center y.
        const platform = this.scene.getPlatformAt?.(player.x, player.body.bottom);

        if (!platform) {
            // No tracked platform under the player (e.g. the main ground) -
            // plain horizontal chase is enough.
            this.chaseTowardPlayer(player, onGround);
            return;
        }

        // Already airborne from a jump triggered below. The delayed push
        // (scheduled at launch) handles starting the sideways motion; this
        // just watches for it reaching the platform and cuts the push so
        // it drops onto the top instead of sailing past the far edge and
        // looping (land past it -> re-approach from the other side ->
        // overshoot back -> repeat).
        if (!onGround) {
            this.stopAtLanding(platform);
            return;
        }

        this.landing = null;

        const leftTarget = platform.left - EDGE_MARGIN;
        const rightTarget = platform.right + EDGE_MARGIN;
        const useLeftEdge = Math.abs(this.x - leftTarget) <= Math.abs(this.x - rightTarget);
        const targetX = useLeftEdge ? leftTarget : rightTarget;
        const dx = targetX - this.x;

        if (Math.abs(dx) > EDGE_TOLERANCE) {
            const goingLeft = dx < 0;
            this.setVelocityX(goingLeft ? -this.speed : this.speed);
            this.setFlipX(this.facesLeft ? !goingLeft : goingLeft);
            this.playAnimation(this.animations?.run);
            return;
        }

        // At the edge - launch straight up first, then push sideways a
        // fixed HORIZONTAL_PUSH_DELAY later regardless of how high it's
        // gotten, so the lateral motion happens well into the rise instead
        // of at takeoff (which was carrying it into the platform's
        // underside before it had gained any height).
        const intoPlatformDir = useLeftEdge ? 1 : -1;
        const landingX = (platform.left + platform.right) / 2;
        this.landing = { platform, direction: intoPlatformDir, targetX: landingX };

        this.setVelocityX(0);
        this.setVelocityY(CLIMB_JUMP_POWER);
        this.playAnimation(this.animations?.jump);

        this.scene.time.delayedCall(HORIZONTAL_PUSH_DELAY, () => {
            if (!this.active || !this.body) return;
            this.setVelocityX(intoPlatformDir * this.speed);
            this.setFlipX(this.facesLeft ? intoPlatformDir < 0 : intoPlatformDir > 0);
        });
    }

    // While airborne from a platform-climb jump: once it reaches the
    // platform's center, cut horizontal velocity so gravity drops it onto
    // the top instead of carrying it past the far edge.
    stopAtLanding(platform) {
        if (!this.landing || this.landing.platform !== platform) return;

        const { direction, targetX } = this.landing;
        const reachedTarget = direction > 0 ? this.x >= targetX : this.x <= targetX;

        if (reachedTarget) {
            this.setVelocityX(0);
            this.landing = null;
        }
    }

    // Kites instead of camping: backs off if the player closes in past
    // meleeRange, closes the gap if the player drifts out toward
    // detectionRange, and only holds ground to throw in between.
    rangedAttack(player, distance, onGround) {
        const facingLeft = player.x < this.x;
        this.setFlipX(this.facesLeft ? !facingLeft : facingLeft);

        // The player's disc only travels ~400px before despawning (see
        // Disc.js), so advanceDistance must sit well inside that or the
        // "hold and throw" band swallows the player's entire safe sniping
        // range and the boss never has to move.
        const retreatDistance = this.meleeRange + 40;
        const advanceDistance = this.meleeRange + 170;

        if (distance < retreatDistance) {
            this.setVelocityX(facingLeft ? this.speed : -this.speed);
        } else if (distance > advanceDistance) {
            this.setVelocityX(facingLeft ? -this.speed : this.speed);
        } else {
            this.setVelocityX(0);
        }

        if (onGround && !this.isThrowingAnim) {
            const isMoving = this.body.velocity.x !== 0;
            this.playAnimation(isMoving ? this.animations?.run : this.animations?.idle);
        }

        if (this.canAttack) {
            this.throwDisc(facingLeft ? -1 : 1);
        }
    }

    // Phase 3 only: jumps toward the player and throws mid-air so it can't
    // just be kited from max disc range forever.
    leapThrow(player) {
        this.canLeap = false;
        this.canAttack = false;

        const facingLeft = player.x < this.x;
        this.setFlipX(this.facesLeft ? !facingLeft : facingLeft);
        const direction = facingLeft ? -1 : 1;

        this.setVelocityX(direction * this.speed * 1.5);
        this.jump();
        this.startThrow(direction);

        this.scene.time.delayedCall(this.getAttackCooldown(), () => {
            this.canAttack = true;
        });
        this.scene.time.delayedCall(LEAP_COOLDOWN, () => {
            this.canLeap = true;
        });
    }

    // Jumps out of the way of an incoming player disc instead of always
    // eating the hit.
    checkDodge(onGround) {
        if (!onGround || !this.canDodge || this.isThrowingAnim) return;

        const discs = this.scene.discs?.getChildren() ?? [];
        const incoming = discs.some((disc) => {
            if (!disc.active) return false;
            const closingIn = (disc.direction === 1 && disc.x < this.x) || (disc.direction === -1 && disc.x > this.x);
            return closingIn
                && Math.abs(disc.x - this.x) < DODGE_RANGE_X
                && Math.abs(disc.y - this.y) < DODGE_RANGE_Y;
        });

        if (!incoming) return;

        this.canDodge = false;
        this.jump();
        this.scene.time.delayedCall(DODGE_COOLDOWN, () => {
            this.canDodge = true;
        });
    }

    throwDisc(direction) {
        this.canAttack = false;
        this.startThrow(direction);

        if (this.getPhase() === 2) {
            this.scene.time.delayedCall(BURST_GAP, () => {
                if (this.active) this.startThrow(direction);
            });
        }

        this.scene.time.delayedCall(this.getAttackCooldown(), () => {
            this.canAttack = true;
        });
    }

    // Plays the wind-up only - the disc is released later by the
    // animationupdate hook once the animation reaches THROW_RELEASE_FRAME.
    // Uses this.play() directly (not the playAnimation guard) so a burst's
    // second shot can restart the animation from frame 0 even though the
    // first one is already playing.
    startThrow(direction) {
        this.pendingThrowDirection = direction;
        this.isThrowingAnim = true;
        this.play(this.animations.throw);
    }

    releaseDisc(direction) {
        const disc = new Disc(this.scene, this.x, this.y, direction);
        this.discGroup.add(disc);
        disc.setVelocity(direction * DISC_SPEED, 0);
    }

    getProjectileGroup() {
        return this.discGroup;
    }

    die() {
        this.discGroup.clear(true, true);
        super.die();
    }
}
