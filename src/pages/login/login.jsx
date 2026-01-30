import styled from "styled-components";
import { Button, Grid } from "@mui/material";
import { useAuth } from "@/hooks";
import MainLogo from "@/assets/logo-react-zzaria-cadastro.png";

export default function Login() {
  const { loginWithGitHub } = useAuth();

  const handleLogin = async () => {
    console.log("ORIGIN:", window.location.origin);

    try {
      await loginWithGitHub();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={4}
      >
        <Grid item xs={12}>
          <Logo src={MainLogo} alt="Logo" />
        </Grid>

        <Grid item xs={12}>
          <GitHubButton onClick={handleLogin}>
            Entrar com o GitHub
          </GitHubButton>
        </Grid>
      </Grid>
    </Container>
  );
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing(3)}px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const Logo = styled.img`
  width: 100%;
  max-width: 250px;
`;

const GitHubButton = styled(Button).attrs({
  variant: "contained",
  fullWidth: true,
})`
  && {
    font-size: ${({ theme }) => theme.typography.h5.fontSize};
    padding: ${({ theme }) => theme.spacing(2)}px;
    text-transform: none;
  }
`;
