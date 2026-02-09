import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Grid,
  TextField,
  Link,
  Typography
} from "@mui/material";
import {
  GitHubButton,
  GoogleButton,
  EmailButton,
  LoginButton,
  CancelButton
} from "@/ui";
import { HOME } from "@/routes";
import { useAuth } from "@/hooks";
import MainLogo from "@/assets/logo-react-zzaria-cadastro.png";

export default function Login() {
  const {
    loginWithGitHub,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail
  } = useAuth();

  // controle de rotas
  const navigate = useNavigate();

  // controle de tela
  const [mode, setMode] = useState("initial"); // initial | login | register

  // campos comuns
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // campos de cadastro
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // controle de erros
  const [error, setError] = useState("");

  // Login com e-mail e senha
  const handleLogin = async () => {
    setError("");

    // Validação rápida antes de chamar o Firebase
    if (!email || !password) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await loginWithEmail(email, password);
      setError("");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("E-mail inválido!");
          break;
        case "auth/user-not-found":
          setError("Usuário não encontrado!");
          break;
        case "auth/wrong-password":
          setError("Senha incorreta!");
          break;
        case "auth/invalid-credential":
          setError("Credenciais inválidas! Verifique e tente novamente.");
          break;
        default:
          setError("Erro ao tentar fazer login!");
      }
    }
  }

  // Cadastro de usuário
  const handleRegister = async () => {
    setError("");

    // Validação rápida antes de chamar o Firebase
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem!");
      return;
    }

    try {
      await registerWithEmail(name, email, password);
      setError("");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Este e-mail já está cadastrado!");
      } else if (error.code === "auth/weak-password") {
        setError("A senha precisa ter no mínimo 6 caracteres!");
      } else if (error.code === "auth/invalid-email") {
        setError("Digite um e-mail válido!");
      } else {
        setError("Erro ao cadastrar usuário!");
      }
    }
  }

  // Reseta formulário e volta para tela inicial
  const handleCancel = () => {
    setMode("initial");
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setError("");
  }

  return (
    <Container>
      <Grid
        container
        direction="column"
        alignItems="stretch"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Logo src={MainLogo} alt="Logo" />
        </Grid>

        {mode === "initial" && (
          <>
            <Grid item xs={12}>
              <GitHubButton onClick={loginWithGitHub}>
                Entrar com o GitHub
              </GitHubButton>
            </Grid>

            <Grid item xs={12}>
              <GoogleButton onClick={loginWithGoogle}>
                Entrar com o Google
              </GoogleButton>
            </Grid>

            <Grid
              item
              xs={12}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap={2}
            >
              <EmailButton onClick={() => setMode("login")}>
                Fazer login
              </EmailButton>

              <Link
                component="button"
                underline="none"
                onClick={() => setMode("register")}
              >
                Ainda não tem cadastro?
              </Link>
            </Grid>
          </>
        )}

        {mode === "login" && (
          <>
            <Grid item xs={12} width="100%">
              <TextField
                autoFocus
                label="E-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} width="100%">
              <TextField
                label="Senha"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <LoginButton type="button" onClick={handleLogin}>
                Entrar
              </LoginButton>

              <CancelButton onClick={handleCancel}>
                Cancelar
              </CancelButton>
            </Grid>
          </>
        )}

        {mode === "register" && (
          <>
            <Grid item xs={12} width="100%">
              <TextField
                autoFocus
                label="Nome completo"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} width="100%">
              <TextField
                label="E-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} width="100%">
              <TextField
                label="Senha"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} width="100%">
              <TextField
                label="Confirmar senha"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <LoginButton type="button" onClick={handleRegister}>
                Cadastrar usuário
              </LoginButton>

              <CancelButton onClick={handleCancel}>
                Cancelar
              </CancelButton>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing(3)}px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 40px;
`;

const Logo = styled.img`
  width: 100%;
  max-width: 350px;
  margin-bottom: 10px;
`;
