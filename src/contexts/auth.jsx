import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import t from "prop-types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { HOME } from "@/routes.jsx";
import { authCadastro, dbCadastro } from "@/services/firebase";

import { loginWithGitHub } from "./github-auth";
import {
  loginWithEmail, registerWithEmail as registerWithEmailService
} from "./email-auth";

/**
 * AuthContext
 *
 * Este é o contexto principal de autenticação do sistema.
 * Ele é responsável por manter o usuário logado disponível globalmente,
 * carregar o perfil do Firestore e disponibilizar funções como login,
 * cadastro e logout para toda a aplicação.
 */
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * Listener global de autenticação
   *
   * Este useEffect fica "escutando" mudanças no login do Firebase.
   * Sempre que o usuário loga ou desloga, o onAuthStateChanged dispara.
   *
   * Aqui é onde o sistema decide:
   * - se o usuário saiu, limpar tudo
   * - se o usuário entrou, carregar o perfil no Firestore
   * - se o perfil não existir, criar um perfil inicial automaticamente
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authCadastro, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        console.log("[Auth] Usuário deslogado");
        return;
      }

      try {
        const userRef = doc(dbCadastro, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile(userSnap.data());
          console.log("[Auth] Perfil carregado:", userSnap.data());
        } else {
          // Se o usuário existir no Auth, mas não tiver documento no Firestore.
          const safeName = currentUser.displayName?.trim();

          const fallbackProfile = {
            name: safeName && safeName.length > 0 ? safeName : "Usuário",
            email: currentUser.email,
            role: "user"
          }

          await setDoc(userRef, fallbackProfile);
          setProfile(fallbackProfile);

          console.log("[Auth] Perfil fallback criado:", fallbackProfile);
        }

        // Após detectar o login, envia o usuário para a rota principal.
        navigate(HOME, { replace: true });

      } catch (error) {
        console.error("[Auth] ERRO AO CARREGAR PERFIL DO USUÁRIO:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  /**
   * registerWithEmail
   *
   * Esta função é a ponte entre o "service" (email-auth.jsx) e o contexto.
   *
   * O arquivo email-auth.jsx cria o usuário e salva no Firestore,
   * mas quem controla o estado global da aplicação é o AuthProvider.
   *
   * Por isso, aqui nós chamamos o registerWithEmailService e,
   * assim que ele retorna, atualizamos o user e o profile na hora.
   *
   * Isso evita aquele problema clássico onde o usuário cadastra,
   * mas o nome só aparece depois de recarregar a página.
   */
  const registerWithEmail = useCallback(async (name, email, password) => {
    try {
      const { user, profile } = await registerWithEmailService(
        name,
        email,
        password
      );

      setUser(user);
      setProfile(profile);

      console.log("[Auth] Cadastro criado com sucesso:", profile);

      return { user, profile };
    } catch (error) {
      console.error("[Auth] Erro no cadastro com email:", error);
      throw error;
    }
  }, []);

  /**
   * logout
   *
   * Faz o logout do usuário e limpa os estados internos.
   * É basicamente a função que encerra a sessão dentro do sistema.
   */
  const logout = useCallback(async () => {
    try {
      await signOut(authCadastro);
      setUser(null);
      setProfile(null);
      console.log("[Auth] Usuário deslogado");
    } catch (error) {
      console.error("[Auth] Erro no logout:", error);
    }
  }, []);

  /**
   * firstName
   *
   * Extrai apenas o primeiro nome do usuário.
   * Isso é útil para mostrar algo mais amigável na interface,
   * como "Olá, Mateus" em vez do nome completo.
   */
  const firstName = useMemo(() => {
    if (!profile?.name) return "";
    return profile.name.split(" ")[0];
  }, [profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        firstName,
        loginWithGitHub,
        loginWithEmail,
        registerWithEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: t.node.isRequired
}

export { AuthProvider, AuthContext }
