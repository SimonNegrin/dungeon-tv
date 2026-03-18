export type Grid = number[][]

export type Player = {
  name: string
  position: Vec2
  origin: Vec2
}

export interface Position {
  x: number
  y: number
}

export interface MapTileAttributes {
  door?: boolean
  spawn?: boolean
}

export interface RogueTileAttributes {
  name: string
  kind: string
}

/**
 * Representa un tile individual en el mapa
 */
export interface Tile<T> {
  /** ID del tile en el spritesheet */
  id: string

  //
  spriteX: number
  spriteY: number

  attributes?: T

  /** Posición X en el grid del mapa */
  x: number
  /** Posición Y en el grid del mapa */
  y: number
}

/**
 * Representa una capa del mapa (ej: Collition, Decoration, Floor)
 */
export interface Layer<T> {
  /** Nombre de la capa */
  name: string
  /** Array de tiles que componen esta capa */
  tiles: Tile<T>[]
  /** Indica si esta capa tiene colisiones */
  collider: boolean
}

/**
 * Representa la estructura completa del mapa del juego
 */
export interface Spritesheet<T> {
  /** Tamaño de cada tile en píxeles */
  tileSize: number
  /** Ancho del mapa en número de tiles */
  mapWidth: number
  /** Alto del mapa en número de tiles */
  mapHeight: number
  /** Capas del mapa (se renderizan en orden) */
  layers: Layer<T>[]
}
