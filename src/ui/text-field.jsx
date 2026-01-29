import MuiTextField from "@mui/material/TextField";

const TextField = (props) => (
  <MuiTextField
    {...props}
    InputLabelProps={{
      style: {
        fontSize: "0.9rem",
        marginTop: "0.09375rem",
        width: "100%"
      },
      ...props.InputLabelProps
    }}
  />
);

export default TextField;
