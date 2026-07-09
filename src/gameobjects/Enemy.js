import * as Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    // config: { texture, health, speed, jumpPower, detectionRange, bounce,
    //           moveDelay, stunDuration, damageInvulnerabilityDuration,
    //           bodySize: {width,height}, bodyOffset: {x,y},
    //           animations: { idle, run, jump, fall } }
    constructor(scene, x, y, config) {
        super(scene, x, y, config.texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.health = config.health;
        this.speed = config.speed;
        this.jumpPower = config.jumpPower;
        this.detectionRange = config.detectionRange ?? 500;
        this.moveDelay = config.moveDelay ?? 0;
        this.stunDuration = config.stunDuration ?? 300;
        // Brief window after being hit during which further takeDamage calls
        // are ignored - stops a single disc overlap (or standing in contact
        // damage) that spans a couple of physics steps from applying more
        // than one hit.
        this.damageInvulnerable = false;
        this.damageInvulnerabilityDuration = config.damageInvulnerabilityDuration ?? 200;
        this.animations = config.animations ?? null;
        this.facesLeft = config.facesLeft ?? false;

        this.setBounce(config.bounce ?? 0.1);
        this.setCollideWorldBounds(true);

        const bodySize = config.bodySize ?? { width: this.width * 0.6, height: this.height * 0.7 };
        const bodyOffset = config.bodyOffset ?? { x: this.width * 0.2, y: this.height * 0.3 };
        this.body.setSize(bodySize.width, bodySize.height);
        this.body.setOffset(bodyOffset.x, bodyOffset.y);

        this.moveTimer = null;
        this.jumpTimer = null;
        this.isStunned = false;

        this.playAnimation(this.animations?.idle);
    }

    update(player) {
        if (!player || !this.body) return;
        if (this.isStunned) {
            this.setVelocity(0);
            return;
        }

        const onGround = this.body.blocked.down || this.body.touching.down;

        this.decideMovement(player, onGround);

        this.updateAirAnimation(onGround);
    }

    // Default movement pattern: chase once the player enters detectionRange,
    // otherwise stand idle. Override this in a subclass for a different
    // movement pattern (patrol, stay put, etc.) while still reusing the
    // shared moveTowards/jump/idle/playAnimation helpers below.
    decideMovement(player, onGround) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distance < this.detectionRange) {
            this.chasePlayer(player, onGround);
        } else {
            this.idle(onGround);
        }
    }

    chasePlayer(player, onGround) {
        this.moveTowards(player.x < this.x);

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

    moveTowards(goingLeft) {
        const applyMove = () => {
            if (!this.body) return;
            this.setVelocityX(goingLeft ? -this.speed : this.speed);
            this.setFlipX(this.facesLeft ? !goingLeft : goingLeft);
        };

        if (this.moveDelay > 0) {
            if (!this.moveTimer || this.moveTimer.hasDispatched) {
                this.moveTimer = this.scene.time.delayedCall(this.moveDelay, applyMove);
            }
        } else {
            applyMove();
        }
    }

    jump() {
        const applyJump = () => {
            if (!this.body) return;
            this.setVelocityY(this.jumpPower);
            this.playAnimation(this.animations?.jump);
        };

        if (this.moveDelay > 0) {
            if (!this.jumpTimer || this.jumpTimer.hasDispatched) {
                this.jumpTimer = this.scene.time.delayedCall(this.moveDelay, applyJump);
            }
        } else {
            applyJump();
        }
    }

    idle(onGround) {
        this.setVelocityX(0);
        if (onGround) {
            this.playAnimation(this.animations?.idle);
        }
    }

    updateAirAnimation(onGround) {
        if (onGround) return;

        if (this.body.velocity.y < -75) {
            this.playAnimation(this.animations?.jump);
        } else if (this.body.velocity.y > 75) {
            this.playAnimation(this.animations?.fall);
        }
    }

    playAnimation(key) {
        if (!key) return;
        if (this.anims.currentAnim?.key !== key) {
            this.play(key);
        }
    }

    stun(duration = this.stunDuration) {
        if (this.isStunned) return;
        this.isStunned = true;
        this.setVelocity(0);
        this.playAnimation(this.animations?.idle);

        if (this.moveTimer) {
            this.moveTimer.remove();
            this.moveTimer = null;
        }
        if (this.jumpTimer) {
            this.jumpTimer.remove();
            this.jumpTimer = null;
        }

        this.scene.time.delayedCall(duration, () => {
            if (!this.body) return;
            this.isStunned = false;
        });
    }

    takeDamage(amount) {
        if (this.damageInvulnerable) return;

        this.damageInvulnerable = true;
        this.stun();
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(this.damageInvulnerabilityDuration, () => {
            if (this.active) this.clearTint();
            this.damageInvulnerable = false;
        });
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        if (this.moveTimer) this.moveTimer.remove();
        if (this.jumpTimer) this.jumpTimer.remove();
        this.destroy();
    }
}