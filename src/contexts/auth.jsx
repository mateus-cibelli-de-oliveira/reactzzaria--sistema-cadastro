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
import { authPedidos, dbPedidos } from "@/services/firebase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listener global de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authPedidos, async (currentUser) => {
      setUser(currentUser);

      // Usuário deslogado
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Busca perfil no Firestore
      const userRef = doc(dbPedidos, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      } else {
        // Fallback (caso extremo)
        const fallbackProfile = {
          name: currentUser.displayName ?? "",
          email: currentUser.email,
          role: "user"
        }

        await setDoc(userRef, fallbackProfile);
        setProfile(fallbackProfile);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Garante usuário no Firestore (ex: login via GitHub)
  useEffect(() => {
    if (!user) return;

    const createUserIfNotExists = async () => {
      const userRef = doc(dbPedidos, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) return;

      const newProfile = {
        email: user.email,
        name: user.displayName ?? "",
        role: "user",
      };

      await setDoc(userRef, newProfile);
      setProfile(newProfile);
    };

    createUserIfNotExists();
  }, [user]);

  // Login com GitHub
  const loginWithGitHub = useCallback(async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(authPedidos, provider);
    } catch (error) {
      console.error("Erro no login com GitHub:", error);
      throw error;
    }
  }, []);

  // Login com email e senha
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(
        authPedidos,
        email,
        password
      );
    } catch (error) {
      console.error("Erro no login com email:", error);
      throw error;
    }
  }, []);

  // Cadastro com e-mail e senha
  const registerWithEmail = useCallback(async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        authPedidos,
        email,
        password
      );

      // Atualiza o displayName no Firebase Auth (PERSISTENTE)
      await updateProfile(result.user, {
        displayName: name,
      });

      // Cria o perfil no Firestore
      const newProfile = {
        name,
        email,
        role: "user"
      };

      const userRef = doc(dbPedidos, "users", result.user.uid);
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
      await signOut(authPedidos);
      setUser(null);
      setProfile(null);
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
