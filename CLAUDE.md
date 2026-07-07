# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Santa Gone Wrong" is a 2D platformer built with Phaser 4 and Vite. Vanilla JS (no TypeScript, no framework), ES modules throughout.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview the production build

There is no test suite, linter, or type checker configured in this project.

## Architecture

### Scene flow

Scenes are registered in `src/config.js` and chained via `this.scene.start(...)`:

`Boot` → `Preloader` (loads all assets, sets nearest-neighbor filtering for pixel art) → `MainMenu` → `LevelSelect` → `Level1`/`Level2`/`Level3` → `GameOver` or `Victory`.

All asset loading lives in `src/scenes/Preloader.js` — add new images/spritesheets there, not in individual level files.

### Level base class (`GameLogic`)

`src/scenes/levels/GameLogic.js` is the shared base class every level (`Level1`, `Level2`, `Level3`) extends. It centralizes:

- **World building**: `createGround(length)` builds the full-level ground (visual tiles + one static collision zone), `createPlatform(height, start, width)` builds a floating platform and records its bounding box in `this.platformRects`.
- **Platform lookup**: `getPlatformAt(x, y)` finds the platform whose top surface is at a given feet position — used by enemy/boss AI to navigate to real platform edges instead of guessing. `y` must be a feet/bottom position (e.g. `body.bottom`), not sprite-center y.
- **Player/enemy wiring**: `createPlayer`, `addEnemy` (sets up collider with platforms + overlap with player + overlap with discs), `addBoss` (wraps `addEnemy` and also wires the boss's projectile group against the player).
- **Combat plumbing**: `createDiscGroup`/`createDisc` for the player's thrown weapon, `onDiscHitEnemy` applies damage and destroys the disc.

A level subclass typically: builds its geometry via `createGround`/`createPlatform` calls, calls `createPlayer` + `createDiscGroup`, calls `createEnemyAnimations`, adds enemies/bosses via small `addX(x, y)` helpers (coordinates are in tile units, converted to pixels against `GROUND_Y`), and implements `update()` (calling `updatePlayer()`/`updateEnemies()`) and `hitEnemy(player, enemy)` (currently always ends the level via `GameOver`).

Levels currently have most enemy/boss placements commented out — check each level file for what's actually active vs. staged for later.

### Enemy/Boss hierarchy

`src/gameobjects/Enemy.js` is the base class for all non-player combatants (`NegaKasey`, `Demon`, `Patroller`, and boss variants). Constructed with a `config` object (texture, health, speed, jumpPower, detectionRange, bounce, moveDelay, stunDuration, bodySize/bodyOffset, animation key map). Default behavior is chase-when-in-range/idle-otherwise (`decideMovement`), with shared helpers (`moveTowards`, `jump`, `idle`, `stun`, `takeDamage`, `die`) that subclasses reuse while overriding `decideMovement` for custom movement patterns (patrol, stationary, etc.).

`src/gameobjects/Boss.js` extends `Enemy`: adds `meleeRange`/`attackCooldown`, an overridable `getProjectileGroup()` hook for bosses that shoot projectiles, and overrides `die()` to trigger `Victory` instead of just despawning.

`NegativeKaseyBoss` (`src/gameobjects/NegativeKaseyBoss.js`) is the most complex enemy in the codebase — a 3-phase fight (phase derived live from `health / maxHealth`, never stored, via `getPhase()`) with per-phase speed/attack-cooldown scaling, platform-climbing AI (via `getPlatformAt`), disc-dodging, and a phase-3 leap-attack. Read its inline comments before modifying — the movement/attack state machine has several ordering-dependent checks (e.g. mid-air climb must be checked before alignment, which must be checked before melee range) that are easy to break by reordering.

### Player

`src/gameobjects/Player.js` is a standalone `Phaser.Physics.Arcade.Sprite` (not built on the `Enemy` config pattern). Movement/jump/animation state is driven from `update(cursors)` each frame. Disc throwing is animation-driven: `throwDisc()` just starts the `throw` animation; the actual disc is spawned from an `animationupdate` listener when the animation reaches a specific frame (mirrors how boss projectile release is frame-synced in `NegativeKaseyBoss`).

### Animations

All Phaser animation definitions live in `src/utils/Animations.js` (`createPlayerAnimations`, `createEnemyAnimations`, `createDiscSelectAnimations`), guarded by `scene.anims.exists(key)` checks since animations are global to the game, not per-scene. Add new animations here rather than inline in scene/gameobject files.

### Tiles

`src/utils/TileFactory.js` maps named tile keys (e.g. `GRASS_TOP1`, `DIRT3`) to frame indices in the `tiles` spritesheet. `createTile` adds a static physics body (for platform tops); `createVisualTile` is decoration-only with no collision.

### Assets

Static assets are served from `public/` (referenced by absolute path, e.g. `/sprites/kaseyspritesheet.png`) and loaded exclusively in `Preloader.js`. Sprite sheets generally use 64x64 frames (characters) or 32x32 (tiles); frame layout conventions (idle/run/jump/fall/throw frame ranges) are established in `Animations.js` and should stay consistent across new character spritesheets so animation code can be reused.
