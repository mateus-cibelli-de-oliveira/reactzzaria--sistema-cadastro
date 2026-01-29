import styled from "styled-components";

export const FormContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
  justify-content: ${({ align }) => align || "flex-start"};

  & > * {
    flex-grow: 1;
  }

  /* Botões não devem crescer */
  & .MuiButton-root {
    flex-grow: 0;
  }
`;
