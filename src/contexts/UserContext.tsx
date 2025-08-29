import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { UserProfile } from "../types";

type Ctx = {
  user: User | null;
  profile: UserProfile | null;
  theme: string; // 🔑 Eklendi
  signInEmail: (email: string, password: string) => Promise<void>;
  signOutNow: () => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
  updateAvatar: (url: string) => Promise<void>;
};

const UserCtx = createContext<Ctx>(null as any);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (u) {
        const ref = doc(db, "users", u.uid);
        unsubProfile = onSnapshot(ref, (s) => {
          const d = s.data() as any;
          if (d) {
            setProfile({ id: s.id, ...d } as UserProfile);
          } else {
            setProfile(null);
          }
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  // ✅ presence takibi
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "presence", user.uid);

    const touch = () =>
      setDoc(ref, { online: true, lastSeen: Date.now() }, { merge: true });

    touch();

    const onVis = () =>
      setDoc(
        ref,
        { online: !document.hidden, lastSeen: Date.now() },
        { merge: true }
      );

    const intv = setInterval(touch, 30_000);

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", () =>
      setDoc(ref, { online: false, lastSeen: Date.now() }, { merge: true })
    );

    return () => {
      clearInterval(intv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [user?.uid]);

  // ✅ Tema güncelleme
  const updateTheme = async (theme: string) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { theme });
  };

  // ✅ Avatar güncelleme
  const updateAvatar = async (url: string) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { avatar: url });
  };

  const signInEmail = async (email: string, password: string) => {
    const allow = (import.meta.env.VITE_ALLOWLIST || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (allow.length && !allow.includes(email.trim().toLowerCase())) {
      throw new Error("Bu sistem sadece yetkili hesaplarla kullanılabilir.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutNow = async () => {
    await signOut(auth);
  };

  // 🔑 Burada theme alanını ekledik
  const value = useMemo(
    () => ({
      user,
      profile,
      theme: profile?.theme || "default",
      signInEmail,
      signOutNow,
      updateTheme,
      updateAvatar,
    }),
    [user, profile]
  );

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
};

export const useUser = () => useContext(UserCtx);
