import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { authCadastro } from "@/services/firebase";

/**
 * loginWithGitHub
 *
 * Esta função realiza o login usando o GitHub.
 * Ao ser chamada, ela abre um popup onde o usuário autoriza o acesso.
 *
 * Quando o login dá certo, o Firebase autentica automaticamente
 * e o AuthContext será atualizado através do onAuthStateChanged.
 *
 * Ou seja: esta função apenas executa o login e deixa o resto
 * para o listener global de autenticação.
 */
export const loginWithGitHub = async () => {
  try {
    // O provider define qual serviço externo será usado (GitHub).
    const provider = new GithubAuthProvider();

    // Abre o popup e finaliza o login.
    const result = await signInWithPopup(authCadastro, provider);

    if (!result.user) {
      console.error("[Auth] ALERTA: usuário null no login GitHub");
      throw new Error("Usuário não autenticado ainda");
    }

    return result.user;
  } catch (error) {
    console.error("[Auth] Erro no login com GitHub:", error);
    throw error;
  }
}
