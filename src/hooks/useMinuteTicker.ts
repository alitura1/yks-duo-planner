import { useEffect, useState } from 'react'

/**
 * Komponenti yaklaşık her dakika (dakika sınırına hizalı) yeniden render eder.
 * Böylece "x dk önce" metni kendi kendine güncellenir.
 */
export const useMinuteTicker = () => {
  const [, setNow] = useState(() => Date.now())

  useEffect(() => {
    // İlk tetikleme (hemen)
    setNow(Date.now())

    // Bir sonraki tam dakikaya kadar bekle, sonra her 60sn'de bir tetikle
    const msToNextMinute = 60000 - (Date.now() % 60000)

    const tId = window.setTimeout(() => {
      setNow(Date.now())
      const iId = window.setInterval(() => setNow(Date.now()), 60000)
      // cleanup: interval referansını effect kapsamı dışına kaçırmamak için return içinde temizleyeceğiz
      ;(window as any).__minuteTickerIntervalId = iId
    }, msToNextMinute)

    return () => {
      clearTimeout(tId)
      const iId = (window as any).__minuteTickerIntervalId
      if (iId) clearInterval(iId)
    }
  }, [])
}
