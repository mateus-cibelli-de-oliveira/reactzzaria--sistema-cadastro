import { Link, useMatch } from "react-router-dom";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  Grid,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  TableContainer,
  TableTitle,
  TableTitleContainer,
  TableButton,
  THead,
  Th
} from "@/ui";
import { useCollection } from "@/hooks";
import { PIZZAS_FLAVOURS, NEW, EDIT } from "@/routes";

function TablePizzasFlavours() {
  const { data: pizzasFlavours, remove } = useCollection("pizzasFlavours");
  const { data: pizzasSizes } = useCollection("pizzasSizes");
  const newFlavourPath = useMatch(`${PIZZAS_FLAVOURS}${NEW}`);

  return (
    <TableContainer>
      <TableTitleContainer>
        <Grid item>
          <TableTitle>Sabores cadastrados</TableTitle>
        </Grid>

        <Grid item>
          <TableButton
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to={`${PIZZAS_FLAVOURS}${NEW}`}
            disabled={!!newFlavourPath}
          >
            Adicionar novo sabor
          </TableButton>
        </Grid>
      </TableTitleContainer>

      <Table>
        <THead>
          <TableRow>
            <Th>Foto</Th>
            <Th>Nome</Th>
            <Th>Valores</Th>
            <Th>Ações</Th>
          </TableRow>
        </THead>

        <TableBody>
          {pizzasFlavours?.map((pizza) => (
            <TableRow key={pizza.id}>
              <TableCell>
                <img src={pizza.image} alt={pizza.name} width="55" />
              </TableCell>

              <TableCell>{pizza.name}</TableCell>

              <TableCell>
                <Grid container direction="column">
                  {Object.entries(pizza.value).map(([sizeId, value]) => {
                    const sizeName = pizzasSizes?.find(
                      (s) => s.id === sizeId,
                    )?.name;

                    return (
                      <Grid key={sizeId} container alignItems="center">
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ pr: 1 }}>
                            {sizeName || "—"}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2" align="right">
                            R$ {value}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
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
                      to={`${PIZZAS_FLAVOURS}${EDIT(pizza.id)}`}
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
    </TableContainer>
  );
}

export default TablePizzasFlavours;
