import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (cadastro)
const firebaseConfigCadastro = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Inicializa o app Firebase nomeado "cadastro"
const appCadastro =
  getApps().find(app => app.name === "cadastro") ??
  initializeApp(firebaseConfigCadastro, "cadastro");

// Exporta instâncias isoladas
export const authCadastro = getAuth(appCadastro);
export const dbCadastro = getFirestore(appCadastro);