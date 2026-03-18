import type {
  Spritesheet,
  MapTileAttributes,
  RogueTileAttributes,
} from "./types"

/**
 * Carga los datos del mapa de un stage desde su archivo JSON
 * @param spritesheetName - Nombre del stage a cargar (ej: "Stage_1")
 * @returns Promise con los datos del mapa del juego
 * @throws Error si no se puede cargar el archivo del mapa
 */
export async function loadSpritesheet<T>(
  spritesheetName: string,
): Promise<Spritesheet<T>> {
  const response = await fetch(`/${spritesheetName}/map.json`)

  if (!response.ok) {
    throw new Error(`No se pudo cargar el stage: ${spritesheetName}`)
  }

  const spritesheet: Spritesheet<T> = await response.json()

  spritesheet.layers.forEach((layer) => {
    layer.tiles.forEach((tile) => {
      const id = Number(tile.id)
      tile.spriteX = id % 8
      tile.spriteY = Math.floor(id / 8)
    })
  })
  return spritesheet
}
