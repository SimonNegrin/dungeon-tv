import StageLoader from "./StageLoader"
import type { Stage } from "./types"

export function loadStage(stageName: string): Promise<Stage> {
  const stageLoader = new StageLoader(stageName)
  return stageLoader.load()
}
