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
            DIRT6: 11,
            DIRT7: 13,
            DIRT8: 15
        };
    }

    createTile(x, y, key, group) {
        const frame = this.tiles[key]
        console.log(key,this.tiles[key]);
        const tile = this.scene.add.image(x, y, 'tiles', frame);

        tile.setOrigin(0, 0);

        this.scene.physics.add.existing(tile, true);

        //adds tiles to group defined above (typically platforms)
        group.add(tile);

        return tile;
    }
}