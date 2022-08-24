import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import FormInput from "Controls/Input";
import DnerhsApi from "api/DnerhsApi";
import useAuth from "hooks/Auth";
import Alert from "components/Alert";
import history from "utils/History";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(2),
  },
  field: {
    margin: theme.spacing(),
  },
}));

const validationSchema = yup.object().shape({
  password: yup.string().required("El campo es requerido"),
  passwordConfirmado: yup.string().required("El campo es requerido")
});

export default function Login() {
  const classes = useStyles();
  const methods = useForm({
    resolver: yupResolver(validationSchema)
  });

  const { handleSubmit, errors, reset, register } = methods;
  const { userData, logout } = useAuth();

  const onSubmit = async (data) => {
    console.log("login", data);
    const payload = {
      password: data.password,
      username: userData.username,
    };

    if (data.password !== data.passwordConfirmado) {
      Alert.show(
        {
          message : "Las contraseñas no coinciden",
          type : "error"
        }
      );

      return;
    }

    try {
      let url = `/usuarios/${userData.userId}/actualizar-password`;
   
      const response = await DnerhsApi.post(url, {
        ...payload,
      });

      Alert.show({
        message : "Contraseña actualizada exitosamente, por favor vuelva a ingresar.",
        type : "success"
      })
    
      logout();
    } catch (error) {
     console.log(error);
     if (error.response) {
       Alert.showServerError(error);
     }
    }
  };

  return (
     <>
     <Grid item xs={12} className={classes.title}>
        <Typography align="center" variant="h5" color="primary">
          Cambio de contraseña
        </Typography>
      </Grid>
      <div className={classes.paper}>
        <FormProvider {...methods}>
          <form>
            <FormInput
              className={classes.form}
              name="password"
              label="Nueva contraseña"
              type="password"
              required
              errorobj={errors} />
            <FormInput
              className={classes.form}
              name="passwordConfirmado"
              label="Confirmar nueva contraseña"
              type="password"
              required
              errorobj={errors} />
          </form>
        </FormProvider>
        <Grid container justifyContent="center" alignItems="center">
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            size="large"
            onClick={() => history.goBack()}
          >
            Volver
          </Button>
        </Grid>
          <Grid item className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit(onSubmit)}
            >
              Actualizar
            </Button>
          </Grid>
      </Grid>
      </div>
      </>
  );
}
