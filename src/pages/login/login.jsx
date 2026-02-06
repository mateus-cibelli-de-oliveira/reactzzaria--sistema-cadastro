import { useState } from "react";
import styled from "styled-components";
import {
  Grid,
  TextField,
  Link,
} from "@mui/material";
import {
  GitHubButton,
  GoogleButton,
  EmailButton,
  LoginButton,
  CancelButton
} from "@/ui";
import { useAuth } from "@/hooks";
import MainLogo from "@/assets/logo-react-zzaria-cadastro.png";

export default function Login() {
  const {
    loginWithGitHub,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail
  } = useAuth();

  // controle de tela
  const [mode, setMode] = useState("initial"); // initial | login | register

  // campos comuns
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // campos de cadastro
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login com email e senha
  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      console.error("Erro ao realizar login:", error);
    }
  }

  // Cadastro de usuário
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error("As senhas não conferem");
      return;
    }

    try {
      await registerWithEmail(name, email, password);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }

  // Reseta formulário e volta para tela inicial
  const handleCancel = () => {
    setMode("initial");
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
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
