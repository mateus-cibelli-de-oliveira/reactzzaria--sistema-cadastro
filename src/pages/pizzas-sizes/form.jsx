import {
  useCallback,
  useState,
  useEffect,
  useReducer,
  useRef,
  useMemo
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { TextField, FormContainer, FormColumn, FormRow } from "@/ui";
import { useCollection } from "@/hooks";
import { PIZZAS_SIZES } from "@/routes";

function FormRegisterSize({ forcedId }) {
  const { id: routeId } = useParams();
  const id = forcedId ?? routeId;
  const { pizza, add, edit } = usePizzaSize(id);
  const navigate = useNavigate();
  const [pizzaEditable, dispatch] = useReducer(reducer, initialState);
  const nameField = useRef(null);

  const texts = useMemo(() => ({
    title: id ? "Editar tamanho" : "Cadastrar novo tamanho",
    button: id ? "Salvar" : "Cadastrar"
  }), [id]);

  useEffect(() => {
    if(nameField.current) {
      nameField.current.focus();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'EDIT',
        payload: pizza
      });
    }
  }, [pizza, id]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        [name]: value
      }
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { id, name, size, slices, flavours } = pizzaEditable;
    const normalizedData = {
      name,
      size: +size,
      slices: +slices,
      flavours: +flavours
    }

    await (id ? edit(id, normalizedData) : add(normalizedData));
    navigate(PIZZAS_SIZES, { replace: true });
  }, [add, edit, navigate, pizzaEditable]);
  return (
    <FormContainer>
      <FormColumn as="form" onSubmit={handleSubmit}>
        <Typography variant="h4">
          {texts.title}
        </Typography>

        <FormRow>
          <TextField
            fullWidth
            label="Nome para esse tamanho. Ex: Pequena"
            name="name"
            value={pizzaEditable.name ?? ""}
            onChange={handleChange}
            inputRef={nameField}
          />
        </FormRow>

        <FormRow>
          <TextField
            fullWidth
            type="number"
            label="Diâmetro da pizza em cm"
            name="size"
            value={pizzaEditable.size ?? ""}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow>
          <TextField
            fullWidth
            type="number"
            label="Quantidade de fatias"
            name="slices"
            value={pizzaEditable.slices ?? ""}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow>
          <TextField
            fullWidth
            type="number"
            label="Quantidade de sabores"
            name="flavours"
            value={pizzaEditable.flavours ?? ""}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow align="flex-end">
          <Button variant="contained" component={Link} to={PIZZAS_SIZES}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            {texts.button}
          </Button>
        </FormRow>
      </FormColumn>
    </FormContainer>
  );
}

const initialState = {
  name: "",
  size: "",
  slices: "",
  flavours: ""
}

function reducer(state, action) {
  if(action.type === 'EDIT') {
    return {
      ...initialState,
      ...action.payload
    }
  }

  if(action.type === 'UPDATE_FIELD') {
    return {
      ...state,
      ...action.payload
    }
  }
  return state;
}

function usePizzaSize(id) {
  const { data, add, edit } = useCollection("pizzasSizes");
  const [pizza, setPizza] = useState(initialState);

  useEffect(() => {
    setPizza(data?.find(p => p.id === id) || initialState);
  }, [data, id]);

  return { pizza, add, edit }
}

export default FormRegisterSize;
