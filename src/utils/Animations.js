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
                start: 15,
                end: 18,
            }),
            frameRate: 12,
            repeat: -1
        });}

    if (!scene.anims.exists('demon_jump')){    
        scene.anims.create({
            key: 'demon_jump',
            frames: scene.anims.generateFrameNumbers('demon', {
                start: 0,
                end: 7
            }),
            frameRate: 6,
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
