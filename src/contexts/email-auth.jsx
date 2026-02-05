import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { authCadastro, dbCadastro } from "@/services/firebase";

/**
 * loginWithEmail
 *
 * Esta função permite que um usuário já cadastrado entre no sistema
 * utilizando email e senha.
 *
 * Ela funciona como o login tradicional: se os dados estiverem corretos,
 * o Firebase autentica o usuário e o onAuthStateChanged será disparado
 * automaticamente no AuthContext.
 */
export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(
      authCadastro,
      email,
      password
    );

    if (!result.user) {
      console.error("[Auth] ALERTA: usuário null no login com email", { email });
      throw new Error("Usuário não autenticado ainda");
    }

    return result.user;
  } catch (error) {
    console.error("[Auth] Erro no login com email:", error);
    throw error;
  }
};

/**
 * registerWithEmail
 *
 * Esta função cria um novo usuário utilizando email e senha e,
 * logo em seguida, cria o perfil inicial no Firestore.
 *
 * É basicamente o processo completo de cadastro:
 * - cria a conta no Firebase Authentication
 * - salva o nome no displayName
 * - cria um documento na coleção "users" no Firestore
 *
 * Assim, o usuário já nasce pronto para entrar no sistema e ter um perfil completo.
 */
export const registerWithEmail = async (name, email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(
      authCadastro,
      email,
      password
    );

    if (!result.user) {
      console.error("[Auth] ALERTA: usuário null ao criar cadastro", { name, email });
      throw new Error("Usuário não autenticado ainda");
    }

    // Atualiza o displayName no Firebase Authentication.
    // Isso faz com que o usuário tenha um nome visível no Auth também.
    await updateProfile(result.user, { displayName: name });

    // Perfil inicial que será armazenado no Firestore.
    const newProfile = {
      name,
      email,
      role: "user"
    }

    // Salva o perfil no Firestore usando o uid como ID do documento.
    const userRef = doc(dbCadastro, "users", result.user.uid);
    await setDoc(userRef, newProfile);

    return {
      user: result.user,
      profile: newProfile
    };
  } catch (error) {
    console.error("[Auth] Erro no cadastro com email:", error);
    throw error;
  }
}
