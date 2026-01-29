import { useLocation } from "react-router-dom";
import { PIZZAS_FLAVOURS, NEW } from "@/routes";
import TablePizzasFlavours from "./table";
import FormRegisterFlavour from "./form";

function PizzasFlavours() {
  const { pathname } = useLocation();

  const isNew = pathname === `${PIZZAS_FLAVOURS}${NEW}`;
  const isEdit = pathname.endsWith("/editar");

  const id = isEdit
    ? pathname
        .replace(PIZZAS_FLAVOURS, "")
        .replace("/editar", "")
        .replace("/", "")
    : null;

  return (
    <>
      {(isNew || isEdit) && (
        <FormRegisterFlavour forcedId={id} />
      )}

      <TablePizzasFlavours />
    </>
  );
}

export default PizzasFlavours;
