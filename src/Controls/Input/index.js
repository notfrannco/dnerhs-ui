import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import "./index.css";

function FormInput(props) {
  const { control } = useFormContext();
  const { name, label, required, errorobj } = props;
  let isError = false;
  let errorMessage = "";
  if (errorobj && errorobj.hasOwnProperty(name)) {
    isError = true;
    errorMessage = errorobj[name].message;
  }

return (
  <Controller
    control={control}
    name={name}
    defaultValue=""
    render={(renderProps) => (
      <TextField
        {...renderProps}
        {...props}
        variant="outlined"
        label={label}
        fullWidth={true}
        InputLabelProps={{
          className: required ? "required-label" : "",
          required: required || false,
        }}
        error={isError}
        helperText={errorMessage}
      />
    )}
  />
)
}

export default FormInput;
