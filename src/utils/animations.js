        
export function createPlayerAnimations(scene){
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 0,
                end: 5
            }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 12,
                end: 17
            }),
            frameRate: 12,
            repeat: -1
        });


        scene.anims.create({
            key: 'jump_start',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 6,
                end: 8,
            }),
            frameRate: 6,
            repeat: 0
        });

        scene.anims.create({
            key: 'fall',
            frames: scene.anims.generateFrameNumbers('kasey', {
                start: 9,
                end: 11,
            }),
            frameRate: 1,
            repeat: 0
        });
}

        
export function createEnemyAnimations(scene){
        scene.anims.create({
            key: 'negative_idle',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 0,
                end: 5
            }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: 'negative_run',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 12,
                end: 17
            }),
            frameRate: 12,
            repeat: -1
        });


        scene.anims.create({
            key: 'negative_jump',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 6,
                end: 8,
            }),
            frameRate: 6,
            repeat: 0
        });

        scene.anims.create({
            key: 'negative_fall',
            frames: scene.anims.generateFrameNumbers('nk', {
                start: 9,
                end: 11,
            }),
            frameRate: 1,
            repeat: 0
        });
}