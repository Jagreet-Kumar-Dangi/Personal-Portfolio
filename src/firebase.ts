import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMfOsakOD3fog6sUNBszlzgWyhU_D6thk",
  authDomain: "jagreetdangi-860f6.firebaseapp.com",
  projectId: "jagreetdangi-860f6",
  storageBucket: "jagreetdangi-860f6.firebasestorage.app",
  messagingSenderId: "170835126671",
  appId: "1:170835126671:web:311a0c814bf80a39f303fa",
  measurementId: "G-WFL7JHG5JW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
