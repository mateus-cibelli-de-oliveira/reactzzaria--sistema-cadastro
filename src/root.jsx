import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { AuthProvider } from "@/contexts";
import App from "@/app";

const theme = createTheme({
  extend: {
    drawerWidth: 280,
  },
  palette: {
    background: {
      default: "#f2f2f2",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f2f2f2",
        },
      },
    },
  },
});
//console.log(theme);

function Root() {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <CssBaseline />
            <GlobalStyle />
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

const GlobalStyle = createGlobalStyle`
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

export default Root;
