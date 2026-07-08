export function createPlayerAnimations(scene){
    if (!scene.anims.exists('idle')){
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 0,
                end: 5
            }),
        frameRate: 6,
        repeat: -1
    });}

    if (!scene.anims.exists('run')){
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 12,
                end: 17
            }),
        frameRate: 12,
        repeat: -1
    });}

    if (!scene.anims.exists('jump_start')){
        scene.anims.create({
            key: 'jump_start',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 6,
                end: 8,
            }),
        frameRate: 6,
        repeat: 0
    });}

    if (!scene.anims.exists('fall')){
        scene.anims.create({
            key: 'fall',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 9,
                end: 11,
            }),
        frameRate: 1,
        repeat: 0
    });}

    if (!scene.anims.exists('throw')){
        scene.anims.create({
            key: 'throw',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 18,
                end: 23,
            }),
            frameRate: 10,
            repeat: 0
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