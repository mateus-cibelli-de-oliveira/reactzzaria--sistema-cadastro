import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import MaterialDrawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { AccountCircle } from "@mui/icons-material";
import {
  Box,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { useAuth } from "@/hooks";
import * as routes from "@/routes";

const Orders = lazy(() => import("@/pages/orders"));
const PizzasSizes = lazy(() => import("@/pages/pizzas-sizes"));
const PizzasFlavours = lazy(() => import("@/pages/pizzas-flavours"));

const Main = () => {
  const { firstName, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const { pathname } = useLocation();
  useScrollToTop();

  const getSelectedMenuItem = useCallback((item) => {
    return pathname === item.link ||
      (pathname.includes(item.link) && item.link !== routes.HOME);
  }, [pathname]);

  const handleOpenMenu = (event) => {
  setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Drawer variant="permanent">
        <DrawerContent>
          <Typography variant="h4">React-zzaria</Typography>
          <Typography sx={{ marginBottom: 1 }}>
            (sistema de cadastro)
          </Typography>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.link} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  selected={getSelectedMenuItem(item)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: "auto" }}>
            <ListItemButton onClick={handleOpenMenu}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <AccountCircle sx={{ fontSize: 28 }} />
              </ListItemIcon>

              <ListItemText disableTypography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    lineHeight: "28px",
                    fontWeight: 600,
                    fontSize: 14.5
                  }}
                >
                  {firstName}
                </Box>
              </ListItemText>
            </ListItemButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              PaperProps={{
                sx: {
                  ml: "-28px"
                }
              }}
            >
              <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
          </Box>
        </DrawerContent>
      </Drawer>
      <Content>
        <Suspense fallback="Loading...">
          <Routes>
            {menuItems.map((item) => (
              <Route
                key={item.link}
                path={`${item.link}/*`}
                element={<item.element />}
                selected={getSelectedMenuItem(item)}
              />
            ))}
          </Routes>
        </Suspense>
      </Content>
    </>
  );
}

function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

const menuItems = [
  {
    label: "Pedidos",
    link: routes.HOME,
    element: Orders,
  },
  {
    label: "Tamanhos de pizzas",
    link: routes.PIZZAS_SIZES,
    element: PizzasSizes,
  },
  {
    label: "Sabores de pizzas",
    link: routes.PIZZAS_FLAVOURS,
    element: PizzasFlavours,
  }
];

const Drawer = styled(MaterialDrawer)`
  && {
    .MuiPaper-root {
      width: ${({ theme }) => theme.extend.drawerWidth}px;
    }
  }
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
  padding: ${({ theme }) => theme.spacing(1)};
`;

const Content = styled.main`
  margin-left: ${({ theme }) => theme.extend.drawerWidth}px;
  padding: ${({ theme }) => theme.spacing(3)};
`;

export default Main;
