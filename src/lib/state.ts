import { writable } from "svelte/store"
import type { Grid } from "./types"

export const grid = writable<Grid | undefined>()
