import React, { useMemo } from "react"
import CanvasOverlay from "./canvas/CanvasOverlay"
import { effectsRegistry, effectKeyFromTheme } from "./effects/registry"

type Props = { themeKey?: string }
const ThemeEffectSwitcher: React.FC<Props> = ({ themeKey }) => {
  const key = effectKeyFromTheme(themeKey || "")
  const effect = useMemo(()=> effectsRegistry[key] || null, [key])
  if (!effect) return null
  return <CanvasOverlay effect={effect} />
}
export default ThemeEffectSwitcher
