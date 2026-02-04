import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import t from "prop-types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { HOME } from "@/routes.jsx";
import { authCadastro, dbCadastro } from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Listener global de autenticação
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
          // Cria fallback se o perfil não existir
          const fallbackProfile = {
            name: currentUser.displayName ?? "",
            email: currentUser.email,
            role: "user"
          };
          await setDoc(userRef, fallbackProfile);
          setProfile(fallbackProfile);
          console.log("[Auth] Perfil fallback criado:", fallbackProfile);
        }

        // Navegação automática após a detecção do login
        navigate(HOME, { replace: true });

      } catch (error) {
        console.error("[Auth] ERRO AO CARREGAR PERFIL DO USUÁRIO:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cadastro com e-mail e senha
  const registerWithEmail = useCallback(async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(authCadastro, email, password);

      if (!result.user) {
        console.error("[Auth] ALERTA: usuário null ao criar cadastro", { name, email });
        throw new Error("Usuário não autenticado ainda");
      }

      await updateProfile(result.user, { displayName: name });

      const newProfile = { name, email, role: "user" };
      const userRef = doc(dbCadastro, "users", result.user.uid);
      await setDoc(userRef, newProfile);

      setUser(result.user);
      setProfile(newProfile);

      console.log("[Auth] Cadastro criado com sucesso:", newProfile);
    } catch (error) {
      console.error("[Auth] Erro no cadastro com email:", error);
      throw error;
    }
  }, []);

  // Login com GitHub
  const loginWithGitHub = useCallback(async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(authCadastro, provider);

      if (!result.user) {
        console.error("[Auth] ALERTA: usuário null no login GitHub");
        throw new Error("Usuário não autenticado ainda");
      }

      console.log("[Auth] Login GitHub realizado:", result.user.email);

    } catch (error) {
      console.error("[Auth] Erro no login com GitHub:", error);
      throw error;
    }
  }, []);

  // Login com e-mail e senha
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(authCadastro, email, password);

      if (!result.user) {
        console.error("[Auth] ALERTA: usuário null no login com email", { email });
        throw new Error("Usuário não autenticado ainda");
      }

      console.log("[Auth] Login com email realizado:", result.user.email);

    } catch (error) {
      console.error("[Auth] Erro no login com email:", error);
      throw error;
    }
  }, []);

  // Logout
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