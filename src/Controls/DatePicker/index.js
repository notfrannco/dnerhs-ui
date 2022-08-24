import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const MuiDatePicker = (props) => {
  const { name, required, errorobj } = props;
  let isError = false;
  let errorMessage = "";
  if (errorobj && errorobj.hasOwnProperty(name)) {
    isError = true;
    errorMessage = errorobj[name].message;
  }
  return (
    <React.Fragment>
      <KeyboardDatePicker
        disableToolbar
        format="DD-MM-YYYY"
        fullWidth={true}
        variant="inline"
        inputVariant="outlined"
        InputLabelProps={{
          className: required ? "required-label" : "",
          required: required || false,
        }}
        error={isError}
        helperText={errorMessage}
        {...props}
      />
    </React.Fragment>
  );
};

function FormDatePicker(props) {
  const { control } = useFormContext();
  const { name, label } = props;

  return (
    <React.Fragment>
      <MuiPickersUtilsProvider locale="es" utils={MomentUtils}>
        <Controller
          as={MuiDatePicker}
          name={name}
          control={control}
          label={label}
          defaultValue={null}
          {...props}
        />
      </MuiPickersUtilsProvider>
    </React.Fragment>
  );
}

export default FormDatePicker;
