export default class TileFactory {
    constructor(scene) {
        this.scene = scene;
        this.tiles = {
            GRASS_TOP1: 0,
            GRASS_TOP2: 4,
            GRASS_TOP3: 8,
            GRASS_TOP4: 12,
            DIRT1: 1,
            DIRT2: 3,
            DIRT3: 5,
            DIRT4: 7,
            DIRT5: 9,
            DIRT6: 11,
            DIRT7: 13,
            DIRT8: 15,
            // Previously-unmapped frames already present in tiles.png (one
            // full column, indices 2/6/10/14). Names are a placeholder guess
            // - confirm against the art before relying on these visually.
            EDGE_TOP1: 2,
            EDGE_TOP2: 6,
            EDGE_TOP3: 10,
            EDGE_TOP4: 14,
        };
    }

    createTile(x, y, key, group) {
        const frame = this.tiles[key]
        const tile = this.scene.add.image(x, y, 'tiles', frame);

        tile.setOrigin(0, 0);

        this.scene.physics.add.existing(tile, true);

        //adds tiles to group defined above (typically platforms)
        group.add(tile);

        return tile;
    }

    createVisualTile(x, y, key) {
        const frame = this.tiles[key];
        const tile = this.scene.add.image(x, y, 'tiles', frame);
        tile.setOrigin(0, 0);
        return tile;
    }
}