import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'; 

function FormSelectAutoComplete(props) {
  
  const { control } = useFormContext();

  const { name, label, options, getOptionLabel,getOptionSelected, required, errorobj } = props;

  let isError = false;
  
  let errorMessage = "";
  
  if (errorobj && errorobj.hasOwnProperty(name)) {
    isError = true;
    errorMessage = errorobj[name].message;
  }

  return (
    <React.Fragment>
     <Controller
      render={(renderProps) => (
        <Autocomplete
          {...renderProps}
          {...props}
          fullWidth
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionSelected={getOptionSelected}
          noOptionsText="Sin opciones"
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                className: required ? "required-label" : "",
                required: required || false,
              }}
              label={label}
              variant="outlined"
              required={required}
              error={isError}
              helperText={errorMessage}
            />
          )}
          defaultValue={null}
          onChange={(_, data) => renderProps.onChange(data)}
        />
      )}
      name={name}
      defaultValue={null}
      control={control}
    />
    </React.Fragment>
  );
}

export default FormSelectAutoComplete;
