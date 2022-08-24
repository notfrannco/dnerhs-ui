import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../../api/DnerhsApi";
import FormInput from "../../../../Controls/Input";
import { useParams, useLocation } from "react-router-dom";
import history from "../../../../utils/History";
import ResponseUtils from "../../../../utils/ResponseUtils";
import Alert from "../../../../components/Alert";

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
    padding: theme.spacing(),
  },
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
}));

const Form = () => {
  const classes = useStyles();
  const [encargadoId, setEncargadoId] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, reset, setValue } = methods;
  let location = useLocation();

  useEffect(() => {
    const load = () => {
      try {
        getServerData();
        setIsReadOnly(location?.state?.readOnly);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const getServerData = async () => {
    try {
      const responseEncargado = await DnerhsApi.get(
        `instituciones/establecimientos/${params.establecimientoId}/encargados`
      );

      if (responseEncargado.data) {
        const values = {
          ciEncargado: responseEncargado.data.cedulaIdentidad,
          nombresEncargado: responseEncargado.data.nombres,
          apellidosEncargado: responseEncargado.data.apellidos,
          emailEncargado: responseEncargado.data.email,
          telefonoEncargado: responseEncargado.data.telefono,
          cargoEncargado: responseEncargado.data.cargo,
        };
        const fields = [
          "ciEncargado",
          "nombresEncargado",
          "apellidosEncargado",
          "emailEncargado",
          "cargoEncargado",
          "telefonoEncargado",
        ];
        fields.forEach((x) => setValue(x, values[x]));
        setEncargadoId(responseEncargado.data.id);
        setIsUpdate(true);
      }
    } catch (err) {
      console.log(err);
      showMessageError(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      let message = "";

      const url = "/instituciones/establecimientos/encargados";

      const payload = {
        cedulaIdentidad: data.ciEncargado,
        cargo: data.cargoEncargado,
        nombres: data.nombresEncargado,
        apellidos: data.apellidosEncargado,
        email: data.emailEncargado,
        telefono: data.telefonoEncargado,
        institucionEstablecimiento: {
          id: params.establecimientoId,
        }
      };

      if (isUpdate) {
        payload.id = encargadoId;

        const response = await DnerhsApi.put(url, {
          ...payload,
        });

        message = "Datos actualizados exitosamente.";
      } else {
        const response = await DnerhsApi.post(url, {
          ...payload,
        });

        message = "Datos guardados exitosamente.";
      }

      Alert.show({
        message,
        type: "success"
      })

      history.goBack();

    } catch (error) {
      console.log(error);
      showMessageError(error);
    }

  };

  const showMessageError = (error) => {
    let message = "Ocurrió un error inesperado, por favor vuelva a reintentar";
    if (error.response) {
      message = ResponseUtils.getMessageError(error.response);
    }

    Alert.show({
      message,
      type: "error"
    })
  }

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Datos del Encargado del Campo de Práctica
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
          <form>
            <Grid container direction="row">
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="ciEncargado"
                  label="CI"
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="cargoEncargado"
                  label="Cargo"
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="nombresEncargado"
                  label="Nombres"
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="apellidosEncargado"
                  label="Apellidos"
                  disabled={isReadOnly}
                />
              </Grid>

              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="emailEncargado"
                  label="Correo electrónico laboral"
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="telefonoEncargado"
                  label="Teléfono de contacto"
                  disabled={isReadOnly}
                />
              </Grid>

              {/* <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="instRectora"
                    label="Institución Rectora"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="emailInstRectora"
                    label="E-mail de la Institución Rectora"
                    disabled={isReadOnly}
                  />
                </Grid> */}
            </Grid>
          </form>
        </FormProvider>
      </div>

      <Grid container direction="row" justifyContent="flex-end" alignItems="center">
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            onClick={() => history.goBack()}
          >
            Atrás
          </Button>
        </Grid>
        {!isReadOnly &&
          (
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Guardar
              </Button>
            </Grid>
          )
        }
      </Grid>
    </div>
  );
};

export default Form;
