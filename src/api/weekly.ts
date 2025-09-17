
// src/api/weekly.ts
import { collection, doc, getDocs, query, where, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Task } from "../types";

function getMondayISO(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7; // days since Monday
  date.setDate(date.getDate() - diff);
  date.setHours(0,0,0,0);
  return date.toISOString().slice(0,10);
}

export async function checkAndRotateWeekIfNeeded(uid: string) {
  try {
    if (!uid) return;
    const usersCol = collection(db, "users");
    const userDocRef = doc(db, "users", uid);
    // read user metadata (lastWeekRotated)
    const userSnap = await getDocs(query(collection(db, "users"), where("id","==",uid))).catch(()=>null);
    // fallback: try doc directly
    let lastWeekRotated = null;
    try {
      const u = (await import("firebase/firestore")).getDoc(userDocRef);
      const usnap = await u;
      if (usnap.exists()) lastWeekRotated = usnap.data().lastWeekRotated || null;
    } catch (e) { /* ignore */ }
    const currentWeekStart = getMondayISO(new Date());
    if (lastWeekRotated === currentWeekStart) return; // already rotated for this week

    // gather tasks for user
    const tasksQ = query(collection(db, "tasks"), where("userId", "==", uid));
    const tSnap = await getDocs(tasksQ);
    const tasks: Task[] = [];
    tSnap.forEach(d => tasks.push({ id: d.id, ...(d.data() as any) } as Task));

    // prepare stats
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const rate = total ? Math.round((completed / total) * 100) : 0;

    // push to weekHistory collection
    await addDoc(collection(db, "weekHistory"), {
      userId: uid,
      weekStart: currentWeekStart,
      weekEnd: currentWeekStart, // for simplicity store start (client can compute range)
      createdAt: new Date().toISOString(),
      tasks,
      stats: { total, completed, rate }
    });

    // delete old tasks
    const deletes = [];
    tSnap.forEach(d => deletes.push(deleteDoc(doc(db, "tasks", d.id))));
    await Promise.all(deletes);

    // update user's lastWeekRotated to prevent duplicate runs
    try { await updateDoc(userDocRef, { lastWeekRotated: currentWeekStart }); } catch(e){ /* ignore */ }

  } catch (err) {
    console.error("week rotation failed", err);
  }
}
