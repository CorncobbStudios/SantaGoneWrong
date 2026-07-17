// Frame layout differs per character sheet (kasey is a 6x4 grid, allergyboy
// is an 8x4 grid), so each playable character has its own frame ranges and
// frame rate. Animation keys are prefixed per character (e.g. 'kasey_idle',
// 'allergyboy_idle') so both characters' animations can coexist globally,
// mirroring the per-enemy prefixing already used in createEnemyAnimations.
// throw.releaseFrame is the animation-local frame index (matching Phaser's
// `frame.index` in the animationupdate event) at which the character's hand
// actually opens - this differs per sheet since throw animations don't all
// have the same frame count, so it can't be a single hardcoded constant.
const PLAYER_FRAME_LAYOUTS = {
    kasey: {
        idle: { start: 0, end: 5, frameRate: 6, repeat: -1 },
        jump_start: { start: 6, end: 8, frameRate: 6, repeat: 0 },
        fall: { start: 9, end: 11, frameRate: 1, repeat: 0 },
        run: { start: 12, end: 17, frameRate: 12, repeat: -1 },
        throw: { start: 18, end: 23, frameRate: 10, repeat: 0, releaseFrame: 4 },
    },
    // Inferred from allergyboysheet.png's row layout (idle/run/jump-fall/throw)
    // - tweak these ranges if they don't match the intended animation.
    allergyboy: {
        idle: { start: 0, end: 7, frameRate: 6, repeat: -1 },
        run: { start: 8, end: 15, frameRate: 14, repeat: -1 },
        jump_start: { start: 16, end: 19, frameRate: 8, repeat: 0 },
        fall: { start: 20, end: 23, frameRate: 2, repeat: 0 },
        throw: { start: 24, end: 31, frameRate: 20, repeat: 0, releaseFrame: 8 },
    },
};

export function getThrowReleaseFrame(character) {
    return PLAYER_FRAME_LAYOUTS[character].throw.releaseFrame;
}

export function createPlayerAnimations(scene, character = 'kasey'){
    const layout = PLAYER_FRAME_LAYOUTS[character];

    for (const [name, { start, end, frameRate, repeat }] of Object.entries(layout)) {
        const key = `${character}_${name}`;
        if (scene.anims.exists(key)) continue;

        scene.anims.create({
            key,
            frames: scene.anims.generateFrameNumbers(character, { start, end }),
            frameRate,
            repeat
        });
    }
}

        
export function createEnemyAnimations(scene){
    if (!scene.anims.exists('negative_idle')){    
        scene.anims.create({
                key: 'negative_idle',
                frames: scene.anims.generateFrameNumbers('nk', {
                    start: 0,
                    end: 5
                }),
            frameRate: 6,
            repeat: -1
        });}

    if (!scene.anims.exists('negative_run')){    
        scene.anims.create({
            key: 'negative_run',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 12,
                end: 17
            }),
            frameRate: 12,
            repeat: -1
        });}

    if (!scene.anims.exists('negative_jump')){
        scene.anims.create({
            key: 'negative_jump',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 6,
                end: 8,
            }),
            frameRate: 6,
            repeat: 0
        });}

    if (!scene.anims.exists('negative_fall')){    
        scene.anims.create({
            key: 'negative_fall',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 9,
                end: 11,
            }),
            frameRate: 1,
            repeat: 0
        });}

    if (!scene.anims.exists('negative_throw')){
        scene.anims.create({
            key: 'negative_throw',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 18,
                end: 23,
            }),
            frameRate: 10,
            repeat: 0
        });
    }

    if (!scene.anims.exists('demon_idle')){
        scene.anims.create({
            key: 'demon_idle',
            frames: scene.anims.generateFrameNumbers('demon', {
                start: 8,
                end: 14,
            }),
            frameRate: 6,
            repeat: -1
        });}

    if (!scene.anims.exists('demon_run')){
        scene.anims.create({
            key: 'demon_run',
            frames: scene.anims.generateFrameNumbers('demon', {
                start: 16,
                end: 19,
            }),
            frameRate: 12,
            repeat: -1
        });}

    if (!scene.anims.exists('demon_jump')){
        scene.anims.create({
            key: 'demon_jump',
            frames: scene.anims.generateFrameNumbers('demon', {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: 0
        });}

    if (!scene.anims.exists('demon_fall')){
        scene.anims.create({
            key: 'demon_fall',
            frames: scene.anims.generateFrameNumbers('demon', {
                start: 3,
                end: 4
            }),
            frameRate: 1,
            repeat: 0
        });}

    // Yeti currently rides the demon spritesheet (see Preloader.js) until
    // real art exists, so it reuses demon's frame layout for now.
    if (!scene.anims.exists('yeti_idle')){
        scene.anims.create({
            key: 'yeti_idle',
            frames: scene.anims.generateFrameNumbers('yeti', { start: 8, end: 14 }),
            frameRate: 6,
            repeat: -1
        });}

    if (!scene.anims.exists('yeti_run')){
        scene.anims.create({
            key: 'yeti_run',
            frames: scene.anims.generateFrameNumbers('yeti', { start: 16, end: 19 }),
            frameRate: 12,
            repeat: -1
        });}

    if (!scene.anims.exists('yeti_jump')){
        scene.anims.create({
            key: 'yeti_jump',
            frames: scene.anims.generateFrameNumbers('yeti', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: 0
        });}

    if (!scene.anims.exists('yeti_fall')){
        scene.anims.create({
            key: 'yeti_fall',
            frames: scene.anims.generateFrameNumbers('yeti', { start: 3, end: 4 }),
            frameRate: 1,
            repeat: 0
        });}

    if (!scene.anims.exists('yeti_throw')){
        scene.anims.create({
            key: 'yeti_throw',
            frames: scene.anims.generateFrameNumbers('yeti', { start: 8, end: 14 }),
            frameRate: 10,
            repeat: 0
        });}

    // Krampus currently rides the nk spritesheet (see Preloader.js) until
    // real art exists. charge/slam reuse the throw frame range as a
    // placeholder telegraph - swap once dedicated frames exist.
    if (!scene.anims.exists('krampus_idle')){
        scene.anims.create({
            key: 'krampus_idle',
            frames: scene.anims.generateFrameNumbers('krampus', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });}

    if (!scene.anims.exists('krampus_run')){
        scene.anims.create({
            key: 'krampus_run',
            frames: scene.anims.generateFrameNumbers('krampus', { start: 12, end: 17 }),
            frameRate: 12,
            repeat: -1
        });}

    if (!scene.anims.exists('krampus_jump')){
        scene.anims.create({
            key: 'krampus_jump',
            frames: scene.anims.generateFrameNumbers('krampus', { start: 6, end: 8 }),
            frameRate: 6,
            repeat: 0
        });}

    if (!scene.anims.exists('krampus_fall')){
        scene.anims.create({
            key: 'krampus_fall',
            frames: scene.anims.generateFrameNumbers('krampus', { start: 9, end: 11 }),
            frameRate: 1,
            repeat: 0
        });}

    if (!scene.anims.exists('krampus_charge')){
        scene.anims.create({
            key: 'krampus_charge',
            frames: scene.anims.generateFrameNumbers('krampus', { start: 18, end: 20 }),
            frameRate: 10,
            repeat: 0
        });}

    if (!scene.anims.exists('krampus_slam')){
        scene.anims.create({
            key: 'krampus_slam',
            frames: scene.anims.generateFrameNumbers('krampus', { start: 21, end: 23 }),
            frameRate: 10,
            repeat: 0
        });}

    // Prince Ishitsukuri's rotation sheet grew into an 8x4 frame grid:
    // row 1 idle, row 2 run, row 3 the overhead-bowl-smash attack (windup/
    // release/recovery all in one clip - the release frames were redrawn
    // into a spin/leap finish, see PrinceIshitsukuri.js for the retuned
    // bowl offsets), row 4 a second attack (not wired up to trigger yet).
    if (!scene.anims.exists('ishitsukuri_idle')){
        scene.anims.create({
            key: 'ishitsukuri_idle',
            frames: scene.anims.generateFrameNumbers('princeishitsukuri', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        });}

    if (!scene.anims.exists('ishitsukuri_run')){
        scene.anims.create({
            key: 'ishitsukuri_run',
            frames: scene.anims.generateFrameNumbers('princeishitsukuri', { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });}

    // Per-frame durations (instead of a flat frameRate) so the swing reads
    // as an actual attack: linger at the raise/peak (frames 19-20), snap
    // fast into the release (frame 21), then hold on impact (frame 22)
    // long enough to register before the recovery frame plays.
    if (!scene.anims.exists('ishitsukuri_attack')){
        scene.anims.create({
            key: 'ishitsukuri_attack',
            frames: [
                { key: 'princeishitsukuri', frame: 16 },
                { key: 'princeishitsukuri', frame: 17 },
                { key: 'princeishitsukuri', frame: 18 },
                { key: 'princeishitsukuri', frame: 19 },
                { key: 'princeishitsukuri', frame: 20 },
                { key: 'princeishitsukuri', frame: 21 },
                { key: 'princeishitsukuri', frame: 22  },
                { key: 'princeishitsukuri', frame: 23 },
            ],
            frameRate: 1,
            repeat: 0
        });}

    // Row 4's alternate attack - animation only, nothing triggers this yet
    // (see PrinceIshitsukuri.js).
    if (!scene.anims.exists('ishitsukuri_attack2')){
        scene.anims.create({
            key: 'ishitsukuri_attack2',
            frames: scene.anims.generateFrameNumbers('princeishitsukuri', { start: 24, end: 31 }),
            frameRate: 8,
            repeat: 0
        });}

    }

    // Idle/erupt states for the Volcano hazard, from the 10x2 volcanosheet
    // (frames 0-9 eruption, 10-17 idle, 18-19 unused).
    export function createVolcanoAnimations(scene){
        if (!scene.anims.exists('volcano_idle')){
            scene.anims.create({
                key: 'volcano_idle',
                frames: scene.anims.generateFrameNumbers('volcano', { start: 10, end: 17 }),
                frameRate: 6,
                repeat: -1
            });}

        if (!scene.anims.exists('volcano_erupt')){
            scene.anims.create({
                key: 'volcano_erupt',
                frames: scene.anims.generateFrameNumbers('volcano', { start: 0, end: 9 }),
                frameRate: 12,
                repeat: 0
            });}
    }

    export function createDiscSelectAnimations(scene){
        if (!scene.anims.exists('disc_select')){
        scene.anims.create({
            key: 'disc_select',
            frames: scene.anims.generateFrameNumbers('discSelect', {
                start: 0,
                end: 7
            }),
            frameRate: 5,
            repeat: -1
        });}
    }