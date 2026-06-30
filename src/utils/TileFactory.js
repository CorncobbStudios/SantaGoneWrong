export default class TileFactory {
    constructor(scene) {
        this.scene = scene;
    }

    createTile(x, y, frame, group) {
        const tile = this.scene.add.image(x, y, 'tiles', frame);

        tile.setOrigin(0, 0);

        this.scene.physics.add.existing(tile, true);

        //adds tiles to group defined above (typically platforms)
        group.add(tile);

        return tile;
    }
}