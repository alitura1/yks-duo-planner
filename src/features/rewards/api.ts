// src/features/rewards/api.ts
import { db } from "../../firebase"; // ✅ src/firebase.ts dosyasına gider
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import type { Reward } from "../../types";
import { REWARD_CHANCE, pickRandomReward } from "./rewardCatalog";

// 🎲 %5 ihtimalle ödül verme
export async function rollRewardForUser(userId: string) {
  const random = Math.random();
  if (random <= REWARD_CHANCE) {
    const reward = await createReward(userId);
    return { won: true, name: reward.name };
  }
  return { won: false };
}

// 🎁 Ödül oluştur
export async function createReward(userId: string) {
  const rewardName = pickRandomReward(); // ✅ katalogtan rastgele ödül
  const newReward: Omit<Reward, "id"> = {
    userId,
    name: rewardName,
    used: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "rewards"), newReward);
  return { ...newReward, id: docRef.id };
}

// 📜 Kullanıcıya ait ödülleri getir (manuel fetch)
export async function listRewards(userId: string): Promise<Reward[]> {
  const rewardsRef = collection(db, "rewards");
  const q = query(rewardsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as any),
  }));
}

// 🔔 Real-time ödül dinleme
export function onRewards(userId: string, cb: (rewards: Reward[]) => void) {
  const q = query(collection(db, "rewards"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const rewards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));
    cb(rewards);
  });
}

// ✅ Ödülü "kullanıldı" işaretle
export async function markRewardUsed(id: string) {
  const ref = doc(db, "rewards", id);
  await updateDoc(ref, { used: true });
}
