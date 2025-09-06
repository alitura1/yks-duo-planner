import React, { createContext, useContext, useEffect, useState } from "react";

export type Role = "user" | "guest";

export interface AppUser {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  verified?: boolean;
  role: Role;
}

interface AuthCtx {
  user: AppUser | null;
  loginWithEmail: (email: string) => Promise<{ sent: boolean; code: string }>;
  verifyCode: (email: string, inputCode: string) => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => void;
  changePassword: (newPass: string) => Promise<boolean>;
  suggestStrongPassword: () => string;
  isGuest: boolean;
}

const Ctx = createContext<AuthCtx>(null as any);

// --- helpers ---
function randomCode(len = 6) {
  const s = "0123456789";
  return Array.from({ length: len }, () => s[Math.floor(Math.random() * s.length)]).join("");
}

function strongPassword() {
  const upp = "ABCDEFGHJKLMNPQRSTUVWXYZ",
    low = "abcdefghijkmnpqrstuvwxyz",
    num = "23456789",
    sym = "!@#$%?*";
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let p = Array.from({ length: 12 }, () => pick(upp + low + num + sym)).join("");
  p = pick(upp) + pick(low) + pick(num) + pick(sym) + p;
  return p.split("").sort(() => Math.random() - 0.5).join("");
}

// --- provider ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  // restore from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("yks:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("yks:user", JSON.stringify(user));
    else localStorage.removeItem("yks:user");
  }, [user]);

  // --- auth actions ---
  const loginWithEmail = async (email: string) => {
    const code = randomCode(6);
    const storeKey = `yks:verify:${email}`;
    localStorage.setItem(storeKey, JSON.stringify({ code, ts: Date.now() }));
    console.info("[YKS Duo] Verification code for", email, "=>", code);
    return { sent: true, code };
  };

  const verifyCode = async (email: string, inputCode: string) => {
    const storeKey = `yks:verify:${email}`;
    try {
      const obj = JSON.parse(localStorage.getItem(storeKey) || "{}");
      if (obj.code && String(obj.code) === String(inputCode).trim()) {
        const u: AppUser = {
          id: email,
          email,
          displayName: email.split("@")[0],
          role: "user",
          verified: true,
        };
        setUser(u);
        return true;
      }
    } catch {}
    return false;
  };

  const continueAsGuest = () => {
    // her misafir için rastgele id verelim, yoksa hep aynı "guest" olur
    const guestId = `guest-${Math.random().toString(36).slice(2, 10)}`;
    setUser({
      id: guestId,
      displayName: "Misafir",
      role: "guest",
      verified: false,
      photoURL: "/default-avatar.png",
    });
  };

  const logout = () => setUser(null);

  const changePassword = async (_newPass: string) => {
    await new Promise((r) => setTimeout(r, 300));
    return true;
  };

  // --- context value ---
  const value: AuthCtx = {
    user,
    loginWithEmail,
    verifyCode,
    continueAsGuest,
    logout,
    changePassword,
    suggestStrongPassword: strongPassword,
    isGuest: user?.role === "guest",
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
