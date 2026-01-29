import {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useReducer,
  useState
} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Typography, InputLabel } from "@mui/material";
import { FormContainer, FormColumn, FormRow, TextField } from "@/ui";
import { useCollection } from "@/hooks";
import { PIZZAS_FLAVOURS } from "@/routes";

function FormRegisterFlavour({ forcedId }) {
  const { id: routeId } = useParams();
  const id = forcedId ?? routeId;
  const nameField = useRef(null);
  const { data: pizzasSizes } = useCollection("pizzasSizes");
  const { pizza, add, edit } = usePizzaFlavour(id);
  const navigate = useNavigate();
  const [pizzaEditable, dispatch] = useReducer(reducer, initialState);

  const texts = useMemo(
    () => ({
      title: id ? "Editar sabor" : "Cadastrar novo sabor",
      button: id ? "Salvar" : "Cadastrar",
    }),
    [id],
  );

  useEffect(() => {
    if (nameField.current) {
      nameField.current.focus();
    }
  }, [id]);

  useEffect(() => {
    if (!id || !pizza?.id) return;

    dispatch({
      type: "EDIT",
      payload: pizza,
    });
  }, [pizza, id]);

  const handleChange = useCallback(async (e) => {
    const { name, value } = e.target;
    const action = name.includes("size-") ? 'UPDATE_SIZE' : 'UPDATE_FIELD';
    const fieldName = name.includes("size-") ? name.replace("size-", "") : name;

    dispatch({
      type: action,
      payload: {
        [fieldName]: value
      }
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    // const fields = e.target.elements;

    const { id, ...data } = pizzaEditable;

    const normalizedData = {
      // name: fields.name.value,
      // image: fields.image.value,
      // value: pizzasSizes.reduce((acc, size) => {
      //   acc[size.id] = +fields[`size-${size.id}`].value;
      //   return acc;
      // }, {})

      ...data,
      value: Object.entries(data.value)
        .reduce((acc, [sizeId, value]) => {
          acc[sizeId] = +value;
          return acc;
      }, {})
    }

    await (id ? edit(id, normalizedData) : add(normalizedData));
    navigate(PIZZAS_FLAVOURS, { replace: true });
  }, [add, edit, navigate, pizzaEditable]);

  return (
    <FormContainer>
      <FormColumn as="form" onSubmit={handleSubmit}>
        <Typography variant="h4">{texts.title}</Typography>

        <FormRow>
          <TextField
            fullWidth
            label="Nome do sabor"
            name="name"
            inputRef={nameField}
            value={pizzaEditable.name ?? ""}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Link da imagem desse sabor"
            name="image"
            value={pizzaEditable.image ?? ""}
            onChange={handleChange}
          />
        </FormRow>

        <FormColumn>
          <InputLabel>Valores em (R$) para cada tamanho:</InputLabel>

          <FormRow>
            {pizzasSizes?.map(size => (
              <TextField
                key={size.id}
                label={size.name}
                name={`size-${size.id}`}
                value={pizzaEditable.value[size.id] ?? ""}
                onChange={handleChange}
                fullWidth
                xs={3}
              />
            ))}
          </FormRow>
        </FormColumn>

        <FormRow align="flex-end">
          <Button variant="contained" component={Link} to={PIZZAS_FLAVOURS}>
            Cancelar
          </Button>

          <Button variant="contained" color="primary" type="submit">
            {texts.button}
          </Button>
        </FormRow>
      </FormColumn>
    </FormContainer>
  );
}

const initialState = {
  name: "",
  image: "",
  value: {}
}

function reducer(state, action) {
  if(action.type === 'EDIT') {
    return {
      ...initialState,
      ...action.payload,
      value: action.payload?.value ?? {}
    }
  }

  if(action.type === 'UPDATE_FIELD') {
    return {
      ...state,
      ...action.payload
    }
  }

  if(action.type === 'UPDATE_SIZE') {
    return {
      ...state,
      value: {
        ...state.value,
        ...action.payload
      }
    }
  }
  return state;
}

function usePizzaFlavour(id) {
  const { data, add, edit } = useCollection("pizzasFlavours");
  const [pizza, setPizza] = useState(initialState);

  useEffect(() => {
    setPizza(data?.find(p => p.id === id) || initialState);
  }, [data, id]);

  return { pizza, add, edit }
}

export default FormRegisterFlavour;
