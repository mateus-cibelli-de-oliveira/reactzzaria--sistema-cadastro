import styled from "styled-components";
import {
  TableCell,
  TableContainer as MaterialTableContainer,
  Paper,
  TableHead,
  Typography,
  Button as MaterialButton,
  Grid
} from "@mui/material";

export const TableContainer = styled(MaterialTableContainer).attrs({
  component: Paper,
})`
  && {
    margin-bottom: ${({ theme }) => theme.spacing(3)};
  }
`;

export const TableTitle = styled(Typography).attrs({
  variant: "h6",
})`
  && {
    padding: ${({ theme }) => theme.spacing(3)};
  }
`;

export const THead = styled(TableHead)`
  && {
    background: ${({ theme }) => theme.palette.common.black};
  }
`;

export const Th = styled(TableCell)`
  && {
    color: ${({ theme }) => theme.palette.common.white};
  }
`;

export const TableTitleContainer = styled(Grid).attrs({
  container: true,
  justifyContent: "space-between",
  alignItems: "center"
})`
  && {
    padding: ${({ theme }) => theme.spacing(3)};

    ${TableTitle} {
      padding: 0;
    }
  }
`;

export const TableButton = styled(MaterialButton).attrs({
  variant: "contained"
})``;
