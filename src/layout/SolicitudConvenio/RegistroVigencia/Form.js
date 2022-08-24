import React, { useContext, useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "api/DnerhsApi";
import { Link, useParams } from "react-router-dom";
import UserContext from "context/User/UserContext";
import FormDatePicker from "Controls/DatePicker";
import Alert from "components/Alert";
import history from "utils/History";
import { trackPromise } from 'react-promise-tracker';

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
  const { userData } = useContext(UserContext);
  const [payload, setPayload] = useState();
  const isAdmin = userData && userData.role.descripcion === "ROLE_ADMIN";
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, reset } = methods;
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        setValuesForEdit();
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const setValuesForEdit = async () => {
    try {
      let url = `/convenios/${params.convenioId}`;
      const response = await DnerhsApi(url);

      setPayload(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      let url = `/convenios/${params.convenioId}/aprobacion?estado=Convenio firmado&fechaFinVigencia=${data.fechaFin}&fechaFirma=${data.fechaFirma}&fechaInicioVigencia=${data.fechaInicio}
      &id=${params.convenioId}&observacion=""`;
      const response = await  trackPromise(DnerhsApi.post(url));
      setSent(true)
      Alert.show(
        {
          message : "Datos guardados exitosamente",
          type : "success"
        }
      )
      history.goBack();
    } catch (error) {
     console.log(error);
     if (error.response) {
      Alert.showServerError(error);
     }
    }
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Registro de vigencia del convenio posterior a la firma
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
          <form>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormDatePicker
                    name="fechaFirma"
                    label="Fecha de firma del convenio"
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormDatePicker
                    name="fechaInicio"
                    label="Fecha de inicio de vigencia del convenio"
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormDatePicker
                    name="fechaFin"
                    label="Fecha de fin de vigencia del convenio"
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            component={Link}
            to={`/convenios/editar/${params.convenioId}`}
          >
            Atrás
          </Button>
        </Grid>
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Form;
