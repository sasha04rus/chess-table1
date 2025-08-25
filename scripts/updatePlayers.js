import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes} (МСК)`;
}

async function updatePlayers() {
  const snapshot = await db.collection("team-1-users").get();

  const players = [];
  const updateTime = formatDate(new Date());
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
