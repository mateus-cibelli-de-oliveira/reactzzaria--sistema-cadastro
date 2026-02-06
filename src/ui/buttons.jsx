import { Button } from "@mui/material";
import styled from "styled-components";

export const GitHubButton = styled(Button).attrs({
  variant: "contained",
  fullWidth: true,
})`
  && {
    font-size: ${({ theme }) => theme.typography.h5.fontSize};
    padding: ${({ theme }) => theme.spacing(2)}px;
    text-transform: none;
    background-color: #1a1a1a;

    &:hover {
      background-color: #000000;
    }
  }
`;

export const GoogleButton = styled(Button).attrs({
  variant: "contained",
  fullWidth: true,
})`
  && {
    font-size: ${({ theme }) => theme.typography.h5.fontSize};
    padding: ${({ theme }) => theme.spacing(2)}px;
    text-transform: none;
  }
`;

export const EmailButton = styled(Button).attrs({
  variant: "outlined",
  fullWidth: true,
})`
  && {
    font-size: ${({ theme }) => theme.typography.h6.fontSize};
    padding: ${({ theme }) => theme.spacing(2)}px;
    text-transform: none;
  }
`;

export const LoginButton = styled(Button).attrs({
  variant: "contained",
  fullWidth: true,
})`
  && {
    padding: ${({ theme }) => theme.spacing(2)}px;
    text-transform: none;
  }
`;

export const CancelButton = styled(Button).attrs({
  variant: "outlined",
  fullWidth: true,
})`
  && {
    padding: ${({ theme }) => theme.spacing(2)}px;
    text-transform: none;
  }
`;
