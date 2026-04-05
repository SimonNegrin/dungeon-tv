import type { Stage, Layer, Tile, Item } from "./types"
import Vec2 from "./Vec2"

type ItemRef = {
  name: string
}

export default class StageLoader {
  constructor(private prefabsMap: Map<string, Item>) {}

  async load(stageName: string): Promise<Stage> {
    const response = await fetch(`/spritesheets/${stageName}/map.json`)

    if (!response.ok) {
      throw new Error(`No se pudo cargar el stage: ${stageName}`)
    }

    const stage: Stage = await response.json()

    stage.spritesheetUrl = `/spritesheets/${stageName}/spritesheet.png`
    stage.layers = this.configLayers(stage.layers)

    return stage
  }

  private configLayers(layers: Layer[]): Layer[] {
    return layers.map((layer) => {
      layer.tiles = this.configTiles(layer.tiles)
      layer.tilesMap = Object.fromEntries(
        layer.tiles.map((tile) => {
          return [tile.position.toString(), tile]
        }),
      )
      return layer
    })
  }

  private configTiles(tiles: Tile[]): Tile[] {
    return tiles.map((data: any): Tile => {
      const id = Number(data.id)
      const spriteX = id % 8
      const spriteY = Math.floor(id / 8)
      const tile: Tile = {
        id: data.id,
        position: new Vec2(data.x, data.y),
        sprite: new Vec2(spriteX, spriteY),
        attributes: data.attributes || {},
      }

      if (tile.attributes.type === "chest") {
        tile.attributes.items = this.createItems(tile.attributes.items)
      }

      return tile
    })
  }

  private createItems(items: ItemRef[]): Item[] {
    return items.map((item: ItemRef): Item => {
      return this.createItem(item.name)
    })
  }

  private createItem(name: string): Item {
    const prefab = this.prefabsMap.get(name)
    if (!prefab) {
      throw new Error(`Prefab with name "${name}" doen't exists"`)
    }
    const item: Item = {
      ...prefab,
    }

    // Create new metadata object if needed
    if (prefab.metadata) {
      item.metadata = { ...prefab.metadata }
    }

    return item
  }
}
