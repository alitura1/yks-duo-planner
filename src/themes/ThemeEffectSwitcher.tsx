import React from "react"
import CanvasOverlay from "./canvas/CanvasOverlay"

type Props = { themeKey?: string }
const ThemeEffectSwitcher: React.FC<Props> = () => {
  return <CanvasOverlay />
}
export default ThemeEffectSwitcher
