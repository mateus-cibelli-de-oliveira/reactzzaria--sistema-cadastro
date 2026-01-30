import { Link, useMatch } from "react-router-dom";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  Grid,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  TableContainer,
  TableTitle,
  TableTitleContainer,
  TableButton,
  THead,
  Th
} from "@/ui";
import { useCollection } from "@/hooks";
import { singularOrPlural } from "@/utils";
import { PIZZAS_SIZES, NEW, EDIT } from "@/routes";

function TablePizzasSizes() {
  const {
    data: pizzasSizes, removePizzaSize: remove
  } = useCollection("pizzasSizes");
  const newSizePath = useMatch(`${PIZZAS_SIZES}${NEW}`);
  return (
    <TableContainer>
      <TableTitleContainer>
        <Grid item>
          <TableTitle>
            Tamanhos cadastrados
          </TableTitle>
        </Grid>

        <Grid item>
          <TableButton
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to={`${PIZZAS_SIZES}${NEW}`}
            disabled={!!newSizePath}
          >
            Adicionar novo tamanho
          </TableButton>
        </Grid>
      </TableTitleContainer>

      <Table>
        <THead>
          <TableRow>
            <Th>Nome</Th>
            <Th>Diâmetro</Th>
            <Th>Fatias</Th>
            <Th>Sabores</Th>
            <Th>Ações</Th>
          </TableRow>
        </THead>

        <TableBody>
          {pizzasSizes?.map(pizza => (
            <TableRow key={pizza.id}>
              <TableCell>{pizza.name}</TableCell>
              <TableCell>{pizza.size} cm</TableCell>
              <TableCell>{pizza.slices} fatias</TableCell>
              <TableCell>
                {pizza.flavours} {" "}
                {singularOrPlural(pizza.flavours, "sabor", "sabores")}
              </TableCell>

              <TableCell align="right" width={220}>
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  wrap="nowrap"
                >
                  <Grid item>
                    <TableButton
                      startIcon={<EditIcon />}
                      component={Link}
                      to={`${PIZZAS_SIZES}${EDIT(pizza.id)}`}
                    >
                      Editar
                    </TableButton>
                  </Grid>

                  <Grid item>
                    <TableButton
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => remove(pizza.id)}
                    >
                      Remover
                    </TableButton>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pizzasSizes?.length === 0 && (
        <Box sx={{ p: 2 }}>
          Não existem tamanhos de pizzas cadastrados.
        </Box>
      )}
    </TableContainer>
  );
}

export default TablePizzasSizes;
