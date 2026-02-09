import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Typography } from "@mui/material";
import { LoginButton, CancelButton } from "@/ui";
import { HOME } from "@/routes";
import { useAuth } from "@/hooks";

export default function FormRegister({ handleCancel }) {
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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
      navigate(HOME);
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

  return (
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
        <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
      </Grid>
    </>
  );
}
