import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import { ToastContainer, toast } from "react-toastify";
import FormInput from "../../Controls/Input";
import FormSelect from "../../Controls/Select";
import { Link, useParams } from "react-router-dom";

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
  const [generoOptions, setGeneroOptions] = useState([]);
  const params = useParams();
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
      const responseGenero = await DnerhsApi.get("/generos", {
        params: { pageSize: 100 },
      });

      console.log("responseGenero", responseGenero);

      setGeneroOptions(
        responseGenero.data.map((x) => ({
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
      convenio: {
        id: params.convenioId,
      },
      estudiante: {
        persona: {
          apellido: data.apellidos,
          cedulaIdentidad: data.ci,
          email: data.email,
          genero: {
            id: data.genero,
          },
          nacionalidad: data.nacionalidad,
          nombre: data.nombres,
          telefono: data.telefono,
        },
      },
    };

    console.log("payload", payload);

    try {
      let url = "/convenios/estudiantes";
      const response = await DnerhsApi.post(url, {
        ...payload,
      });
      if (response.status === 200) {
        toast.success("Guardado Correctamente.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        reset();
      } else {
        alert("Error al conectarse");
        console.log("error al conectarse");
      }
    } catch (error) {
      console.log("error catch");
    }
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Estudiante
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
                  <FormInput name="ci" label="Cédula de Identidad" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="nombres" label="Nombres" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="apellidos" label="Apellidos" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="genero"
                    label="Género"
                    options={generoOptions}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="nacionalidad" label="Nacionalidad" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="telefono" label="Télefono" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="email" label="E-mail" />
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
            component={Link}
            to={`/datosPracticas/${params.convenioId}`}
          >
            Volver
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
