import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";
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
import { authCadastro, dbCadastro } from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listener global de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      authCadastro,
      async (currentUser) => {
        try {
          setUser(currentUser);

          if (!currentUser) {
            setProfile(null);
            setLoading(false);
            return;
          }

          const userRef = doc(dbCadastro, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setProfile(userSnap.data());
          } else {
            const fallbackProfile = {
              name: currentUser.displayName ?? "",
              email: currentUser.email,
              role: "user"
            }

            await setDoc(userRef, fallbackProfile);
            setProfile(fallbackProfile);
          }

          setLoading(false);
        } catch (error) {
          console.error("ERRO AO CARREGAR PERFIL DO USUÁRIO:", error);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Garante usuário no Firestore (ex: login via GitHub)
  useEffect(() => {
    if (!user) return;

    const createUserIfNotExists = async () => {
      const userRef = doc(dbCadastro, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) return;

      const newProfile = {
        email: user.email,
        name: user.displayName ?? "",
        role: "user"
      }

      await setDoc(userRef, newProfile);
      setProfile(newProfile);
    }

    createUserIfNotExists();
  }, [user]);

  // Login com GitHub
  const loginWithGitHub = useCallback(async () => {
    try {
      await signOut(authCadastro);
      setUser(null);
      setProfile(null);

      authCadastro.currentUser = null;
  
      const provider = new GithubAuthProvider();
      await signInWithPopup(authCadastro, provider);
    } catch (error) {
      console.error("Erro no login com GitHub:", error);
      throw error;
    }
  }, []);

  // Login com e-mail e senha
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      await signOut(authCadastro);    
      setUser(null);                    
      setProfile(null);     

      authCadastro.currentUser = null;   

      await signInWithEmailAndPassword(authCadastro, email, password);
    } catch (error) {
      console.error("Erro no login com email:", error);
      throw error;
    }
  }, []);

  // Cadastro com e-mail e senha
  const registerWithEmail = useCallback(async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        authCadastro,
        email,
        password
      );
  
      // Garante que o usuário está definido
      if (!result.user) throw new Error("Usuário não autenticado ainda");
  
      // Atualiza o displayName no Firebase Auth (PERSISTENTE)
      await updateProfile(result.user, {
        displayName: name
      });
  
      // Cria o perfil no Firestore
      const newProfile = {
        name,
        email,
        role: "user"
      }
  
      const userRef = doc(dbCadastro, "users", result.user.uid);
      await setDoc(userRef, newProfile);
  
      // Estados locais
      setUser(result.user);
      setProfile(newProfile);
    } catch (error) {
      console.error("Erro no cadastro com email:", error);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(authCadastro);

      setUser(null);
      setProfile(null);

      authCadastro.currentUser = null;

    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, []);

  // Primeiro nome (vem do Firestore)
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
