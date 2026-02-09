import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Typography } from "@mui/material";
import { LoginButton, CancelButton } from "@/ui";
import { HOME } from "@/routes";
import { useAuth } from "@/hooks";

export default function FormLogin({ handleCancel }) {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      navigate(HOME);
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

  return (
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
        <LoginButton type="button" onClick={handleLogin}>Entrar</LoginButton>
        <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
      </Grid>
    </>
  );
}
