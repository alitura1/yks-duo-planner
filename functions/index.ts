import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

function getMondayISO(d = new Date()) {
  const date = new Date(d as any);
  const day = date.getDay();
  const diff = (day + 6) % 7; // days since Monday
  date.setDate(date.getDate() - diff);
  date.setHours(0,0,0,0);
  return date.toISOString().slice(0,10);
}

// Scheduled function: every Monday at 00:05 (UTC) - adjust as needed for timezone
export const weeklyRotate = functions.pubsub.schedule('5 0 * * 1').onRun(async (context) => {
  console.log("weeklyRotate triggered", new Date().toISOString());
  const usersSnap = await db.collection("users").get();
  const currentWeekStart = getMondayISO(new Date());
  const ops: Promise<any>[] = [];
  usersSnap.forEach(userDoc => {
    const uid = userDoc.id;
    const data = userDoc.data();
    const last = data.lastWeekRotated || null;
    if (last === currentWeekStart) {
      // already rotated
      return;
    }
    ops.push((async () => {
      try {
        const tasksSnap = await db.collection("tasks").where("userId","==",uid).get();
        const tasks: any[] = [];
        tasksSnap.forEach(t => tasks.push({ id: t.id, ...(t.data() as any) }));
        const total = tasks.length;
        const completed = tasks.filter(t=>t.done).length;
        const rate = total? Math.round((completed/total)*100):0;
        await db.collection("weekHistory").add({
          userId: uid,
          weekStart: currentWeekStart,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          tasks,
          stats: { total, completed, rate }
        });
        // delete tasks
        const batch = db.batch();
        tasksSnap.forEach(t => batch.delete(t.ref));
        await batch.commit();
        await db.collection("users").doc(uid).update({ lastWeekRotated: currentWeekStart });
        console.log("Rotated for user", uid);
      } catch (e) {
        console.error("Rotation error for user", uid, e);
      }
    })());
  });
  await Promise.all(ops);
  console.log("weeklyRotate finished");
  return null;
});
