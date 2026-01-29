import { useLocation } from "react-router-dom";
import { PIZZAS_SIZES, NEW } from "@/routes";
import TablePizzasSizes from "./table";
import FormRegisterSize from "./form";

function PizzasSizes() {
  const { pathname } = useLocation();

  const isNew = pathname === `${PIZZAS_SIZES}${NEW}`;
  const isEdit = pathname.endsWith("/editar");

  const id = isEdit
    ? pathname
        .replace(PIZZAS_SIZES, "")
        .replace("/editar", "")
        .replace("/", "")
    : null;

  return (
    <>
      {(isNew || isEdit) && (
        <FormRegisterSize forcedId={id} />
      )}

      <TablePizzasSizes />
    </>
  );
}

export default PizzasSizes;
