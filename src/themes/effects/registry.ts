import type { Effect } from "./types"
import { mcqueen } from "./sets/mcqueen"
import { batman } from "./sets/batman"
import { spiderman } from "./sets/spiderman"
import { superman } from "./sets/superman"
import { joker } from "./sets/joker"
import { constantine } from "./sets/constantine"
import { vader } from "./sets/vader"
import { kitty } from "./sets/kitty"
import { mlp } from "./sets/mlp"
import { gothic } from "./sets/gothic"
import { neonOcean } from "./sets/neon_ocean"
import { mineFlowers } from "./sets/minecraft_flowers"
import { mineMining } from "./sets/minecraft_mining"
import { mineNether } from "./sets/minecraft_nether"
import { mineEnd } from "./sets/minecraft_end"

export const effectsRegistry: Record<string, Effect> = {
  mcqueen,
  batman,
  spiderman,
  superman,
  joker,
  constantine,
  vader,
  kitty,
  mlp,
  gothic,
  "neon-okyanus": neonOcean,
  "minecraft-cicekler": mineFlowers,
  "minecraft-macera": mineMining,
  "minecraft-nether": mineNether,
  "minecraft-end": mineEnd,
}

const aliasMap: Record<string, string> = {
  "şimşek mcqueen":"mcqueen","mcqueen":"mcqueen","şimşek mcqueen":"mcqueen",
  "gothic":"gothic","gothik":"gothic",
  "neon okyanus":"neon-okyanus","neon okyanus 🌊":"neon-okyanus","neon-okyanus":"neon-okyanus",
  "batman":"batman",
  "spiderman":"spiderman","örümcek adam":"spiderman",
  "superman":"superman",
  "joker":"joker",
  "john constantine":"constantine","constantine":"constantine",
  "darth vader":"vader","anakin":"vader","vader":"vader",
  "hello kitty":"kitty","kitty":"kitty",
  "my little pony":"mlp","mlp":"mlp",
  "minecraft çiçekler":"minecraft-cicekler","minecraft cicekler":"minecraft-cicekler",
  "minecraft macera":"minecraft-macera","minecraft madencilik":"minecraft-macera","minecraft mining":"minecraft-macera",
  "minecraft nether":"minecraft-nether",
  "minecraft end":"minecraft-end","the end":"minecraft-end",
}

export function effectKeyFromTheme(input: string): string {
  const key = (input || "").trim().toLowerCase()
  return aliasMap[key] || key
}
