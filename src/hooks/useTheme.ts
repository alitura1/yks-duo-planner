import { useEffect, useState } from "react"

export const useTheme = (initialTheme = "cicek") => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || initialTheme
  })
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true"
  })

  // değişiklikleri kaydet
  useEffect(() => {
    localStorage.setItem("theme", theme)
    const body = document.body
    body.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) body.classList.remove(cls)
    })
    body.classList.add(`theme-${theme}`)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode))
    const body = document.body
    if (darkMode) body.classList.add("dark")
    else body.classList.remove("dark")
  }, [darkMode])

  return { theme, setTheme, darkMode, setDarkMode }
}
