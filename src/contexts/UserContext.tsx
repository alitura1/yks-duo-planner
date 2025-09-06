import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  signInAnonymously,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import type { UserProfile } from "../types";

// Public shape expected across the app
export interface CtxUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

interface UserCtx {
  // firebase user (or guest anon user)
  user: CtxUser | null;
  // profile document from Firestore (admins etc.); null for guests
  profile: UserProfile | null;
  // theme convenience (falls back to 'gothic' when unknown)
  theme: string;
  // read-only guest?
  isGuest: boolean;
  // auth actions
  signInEmail: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOutNow: () => Promise<void>;
}

const Ctx = createContext<UserCtx>(null as any);

function toCtxUser(u: FirebaseUser | null): CtxUser | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    isAnonymous: u.isAnonymous,
  };
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Subscribe to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setFbUser(u);
    });
    return () => unsub();
  }, []);

  // Subscribe to profile doc when signed-in with a "real" account (not guest/anon)
  useEffect(() => {
    if (!fbUser || fbUser.isAnonymous) {
      setProfile(null);
      return;
    }
    const ref = doc(db, "users", fbUser.uid);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any;
      if (data) setProfile({ id: snap.id, ...data });
      else setProfile(null);
    }, (_err) => {
      // Don't crash UI if missing permissions
      setProfile(null);
    });
    return () => unsub();
  }, [fbUser?.uid, fbUser?.isAnonymous]);

  const signInEmail = async (email: string, password: string) => {
    // preserve original API name to avoid "signInEmail Function" errors
    await signInWithEmailAndPassword(auth, email, password);
  };

  const continueAsGuest = async () => {
    // Use Firebase Anonymous auth so Firestore reads can succeed under common rules
    await signInAnonymously(auth);
    // profile will remain null; isGuest will be true via isAnonymous flag
  };

  const signOutNow = async () => {
    await fbSignOut(auth);
  };

  const value: UserCtx = useMemo(() => {
    const user = toCtxUser(fbUser);
    const isGuest = !!fbUser?.isAnonymous;
    const theme = profile?.theme ?? "gothic";
    return {
      user,
      profile,
      theme,
      isGuest,
      signInEmail,
      continueAsGuest,
      signOutNow,
    };
  }, [fbUser, profile]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

// Primary hook
export const useUser = () => useContext(Ctx);

// Back-compat: some files import AuthContext/useAuth; keep alias
export const useAuth = useUser;
export const AuthProvider = UserProvider;
