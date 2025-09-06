import React, { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { getTheme } from "../../themes"

interface RewardPopupProps {
  reward: string | null
  themeKey: string
}

/**
 * CSS-based slide+fade banner. 
 * - reward: null => gizli
 * - reward: string => göster ve hook tarafı 3s sonra kapatır
 * Animasyon süresi: ~360ms
 */
const RewardPopup = (props: any) => {
  const { isGuest } = useAuth()
  if (isGuest) {
    return <div>Sadece giriş yapan kullanıcılar ödül oluşturabilir.</div>
  }

  return <RewardPopupOrig {...props} />
}

// original
const RewardPopupOrig: React.FC<RewardPopupProps> = ({ reward, themeKey }) => {
  const [render, setRender] = useState(false)
  const [visible, setVisible] = useState(false)

  // mount / enter / exit handling so we can run exit animation before unmount
  useEffect(() => {
    if (reward) {
      setRender(true)
      // trigger the transition on next frame
      requestAnimationFrame(() => setVisible(true))
      return
    }
    // reward === null -> start exit animation
    setVisible(false)
    const t = window.setTimeout(() => {
      setRender(false)
    }, 420) // slightly larger than transition
    return () => clearTimeout(t)
  }, [reward])

  if (!render) return null

  const themeDef = getTheme(themeKey)
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 50,
    pointerEvents: "none",
    transform: visible ? "translateY(0)" : "translateY(-110%)",
    opacity: visible ? 1 : 0,
    transition: "transform 360ms cubic-bezier(.2,.9,.2,1), opacity 360ms ease",
  }

  const innerStyle: React.CSSProperties = {
    background: themeDef?.colors?.accent ?? "linear-gradient(90deg,#ff7a18,#ff3b30)",
    color: themeDef?.colors?.text ?? "#fff",
    padding: "10px 18px",
    borderRadius: "0 0 12px 12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    fontWeight: 600,
    pointerEvents: "auto",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
  }

  return (
    <div style={containerStyle} aria-hidden={!visible}>
      <div style={innerStyle}>
        <span style={{ fontSize: 18 }}>🎁</span>
        <span>{`Hediye Kazandın: ${reward}`}</span>
      </div>
    </div>
  )
}

export default RewardPopup
