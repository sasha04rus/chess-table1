import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function updatePlayers() {
  const snapshot = await db.collection("team-1-users").get();

  const players = [];
  const updateTime = new Date().toISOString();
  snapshot.forEach(doc => {
    players.push({
      id: doc.id,
      ...doc.data()
    });
  });

  const output = {
    updateTime,
    players
  };

  fs.writeFileSync("players.json", JSON.stringify(output, null, 2));
}

updatePlayers();
