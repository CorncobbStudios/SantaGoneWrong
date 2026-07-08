const PIP_SIZE = 24;
const PIP_GAP = 8;
const MARGIN = 16;

export class HUD {
    constructor(scene, maxHealth) {
        this.scene = scene;
        this.maxHealth = maxHealth;
        this.pips = [];

        for (let i = 0; i < maxHealth; i++) {
            const pip = scene.add.rectangle(
                MARGIN + i * (PIP_SIZE + PIP_GAP),
                MARGIN,
                PIP_SIZE,
                PIP_SIZE,
                0xe94560
            );
            pip.setOrigin(0, 0);
            pip.setStrokeStyle(2, 0xffffff);
            pip.setScrollFactor(0);
            pip.setDepth(1000);
            this.pips.push(pip);
        }
    }

    setHealth(value) {
        this.pips.forEach((pip, i) => {
            pip.setFillStyle(i < value ? 0xe94560 : 0x16213e);
        });
    }
}
