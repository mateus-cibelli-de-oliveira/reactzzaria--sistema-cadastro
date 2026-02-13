import { useEffect, useState } from "react";
import styled from "styled-components";
import { Grid, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GitHubButton, GoogleButton, EmailButton } from "@/ui";
import { useAuth } from "@/hooks";
import FormLogin from "./form-login.jsx";
import FormRegister from "./form-register.jsx";
import MainLogo from "@/assets/logo-react-zzaria-cadastro.png";

export default function Login() {
  const {
    user, profile, loading, loginWithGitHub, loginWithGoogle
  } = useAuth();
  const navigate = useNavigate();

  // controle de tela
  const [mode, setMode] = useState("initial");

  useEffect(() => {
    if (loading) return;

    if (user && profile) {
      navigate("/", { replace: true });
    }
  }, [user, profile, loading, navigate]);

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
          <FormLogin handleCancelMode={() => setMode("initial")} />
        )}

        {mode === "register" && (
          <FormRegister handleCancelMode={() => setMode("initial")} />
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
