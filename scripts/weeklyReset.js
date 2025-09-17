
// scripts/weeklyReset.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Service account json (GitHub Secret'ten geliyor)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase init
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

async function resetWeeklyTasks() {
  console.log("📌 Weekly reset started...");
  const tasksSnap = await db.collection("tasks").get();

  const batch = db.batch();
  const historyRef = db.collection("weekHistory").doc(new Date().toISOString());

  let historyData = {};
  tasksSnap.forEach((doc) => {
    historyData[doc.id] = doc.data();
    batch.delete(doc.ref);
  });

  batch.set(historyRef, {
    createdAt: new Date(),
    data: historyData,
  });

  await batch.commit();
  console.log("✅ Weekly reset done!");
}

resetWeeklyTasks().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
