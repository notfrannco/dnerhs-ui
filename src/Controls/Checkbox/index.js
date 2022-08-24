import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const MuiCheckbox = (props) => {
  const { label, name } = props;
  return (
    <FormControlLabel
      label={label}
      labelPlacement="start"
      control={<Checkbox name={name} {...props} />}
    />
  );
};

function FormCheckBox(props) {
  const { control } = useFormContext();
  const { name, label, disabled } = props;
  return (
    <React.Fragment>
      <Controller
      //  as={MuiCheckbox}
        control={control}
        name={name}
        defaultValue={false}
        render={propsRender => (
          <MuiCheckbox
            {...propsRender}
            {...props}
            label={label}
            onChange={e => propsRender.onChange(e.target.checked)}
            checked={propsRender.value}
           />
        )}
      />
    </React.Fragment>
  );
}

export default FormCheckBox;
