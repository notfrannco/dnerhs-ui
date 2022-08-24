import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import { ToastContainer, toast } from "react-toastify";
import FormInput from "../../Controls/Input";
import FormSelect from "../../Controls/Select";

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
  const [establecimientosOptions, setEstablecimientosOptions] = useState([]);
  const [camposPracticaOptions, setCamposPracticaOptions] = useState([]);
  const [turnosOptions, setTurnosOptions] = useState([]);
  const methods = useForm({});
  const { handleSubmit, errors, reset } = methods;

  useEffect(() => {
    const load = () => {
      try {
        getServerData();
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const getServerData = async () => {
    try {
      const responseEstablecimientos = await DnerhsApi.get(
        "/establecimientos",
        {
          params: { pageSize: 100 },
        }
      );

      const responseCamposPractica = await DnerhsApi.get("/campoPractica", {
        params: { pageSize: 100 },
      });

      const responseTurnos = await DnerhsApi.get("/turnos", {
        params: { pageSize: 100 },
      });

      console.log("responseEstablecimientos", responseEstablecimientos);

      setEstablecimientosOptions(
        responseEstablecimientos.data.map((x) => ({
          label: x.establecimiento,
          id: x.id,
        }))
      );

      setCamposPracticaOptions(
        responseCamposPractica.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );

      setTurnosOptions(
        responseTurnos.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );
    } catch (err) {
      toast.error(err, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Error al cargar pagina", err);
    }
  };

  const onSubmit = async (data) => {
    console.log("data", data);
    const payload = {
      establecimiento: { id: data.establecimiento },
      campoPractica: { id: data.campoPractica },
      nroPlazas: data.nroPlazas,
      turno: { id: data.turno },
    };

    console.log("payload", payload);

    try {
      let url = "/campoPracticaEstablecimiento";
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
          Campo de Práctica y Plazas por Establecimiento
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
                  <FormSelect
                    name="establecimiento"
                    label="Establecimiento"
                    options={establecimientosOptions}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="campoPractica"
                    label="Campo de Práctica"
                    options={camposPracticaOptions}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="nroPlazas" label="N° Plazas" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="turno"
                    label="Turno"
                    options={turnosOptions}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid container direction="row" justify="flex-end" alignItems="center">
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
            onClick={() =>
              (window.location.href = "/camposPracticaEstablecimiento")
            }
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
