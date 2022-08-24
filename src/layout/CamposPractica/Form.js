import React from "react";
import { Button, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import { ToastContainer, toast } from "react-toastify";
import FormInput from "../../Controls/Input";

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  field: {
    margin: theme.spacing(),
  },
}));

const Form = () => {
  const classes = useStyles();
  const methods = useForm({});
  const { handleSubmit, errors, reset } = methods;

  const onSubmit = async (data) => {
    console.log("data", data);
    const payload = {
      descripcion: data.descripcion,
    };

    console.log("payload", payload);

    try {
      let url = "/campoPractica";
      const response = await DnerhsApi.post(url, {
        ...payload,
      });
      if (response.status === 201) {
        toast.success("Guardado Correctamente.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        reset();
      }
      //aca estaremos validando los demas status ejemplo: 404, 500
      else {
        alert("Error al conectarse");
        console.log("error al conectarse");
      }
    } catch (error) {
      //notificacionError(error);
      console.log("error catch");
    }
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Campo de Práctica
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
          <form>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start"
            >
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="descripcion" label="Campo de Práctica" />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Grid>
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/camposPractica")}
          >
            Volver al listado
          </Button>
        </Grid>
      </Grid>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Form;
