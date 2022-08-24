import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import FormInput from "../../Controls/Input";
import Alert from "../../components/Alert";
import ResponseUtils from "../../utils/ResponseUtils";
import history from "../../utils/History";
import { useParams, useLocation } from "react-router-dom";
import FormSelect from "../../Controls/Select";
import { findByNumeroCedula } from "services/DatosPersonalesService";
import { trackPromise } from "react-promise-tracker";

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: theme.spacing(16),
    paddingRight: theme.spacing(16),
  },
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  field: {
    margin: theme.spacing(),
  },
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  button: {
    margin: theme.spacing(2),
  },
  okButton: {
    color: "#fff",
    backgroundColor: "#01C12B",
    margin: theme.spacing(),
  },
  denyButton: {
    color: "#fff",
    backgroundColor: "#ff0000",
    margin: theme.spacing(),
  },
  title: {
    fontSize: 14,
  },
}));


const Form = () => {
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const params = useParams();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [responsableResponseData, setResponsableResponseData] = useState({});
  const [nombreServicioOptions, setNombreServicioOptions] = useState([]);
  const [tipoEstablecimientoOptions, setTipoEstablecimientoOptions] = useState([]);
  const methods = useForm({});
  const { handleSubmit, errors, reset, setValue } = methods;
  let { state } = useLocation();


  useEffect(() => {
    const load = () => {
      try {
        getServerData();

        if (state?.edit || state?.readOnly) {
          setIsUpdate(state?.edit);
          setIsReadOnly(state?.readOnly);
          setValuesForEdit();
        } else {
          setIsAddMode(true);
        }

      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const getServerData = async () => {
    try {
      const responseTipoEstablecimientoOptions = await DnerhsApi.get("/tipos-establecimientos", {
        params: { pageSize: 100 },
      });
      const responseNombreServicioOptions = await DnerhsApi.get("/servicios");
      setNombreServicioOptions(
        responseNombreServicioOptions.data.map((x) => ({
          label: x.nombre,
          id: x.id,
        }))
      );
      setTipoEstablecimientoOptions(
        responseTipoEstablecimientoOptions.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );

    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  };

  const showServerError = (error) => {
    let message = "Ocurrió un error inesperado, por favor vuelva a reintentar";
    if (error.response) {
      message = ResponseUtils.getMessageError(error.response);
    }

    Alert.show({
      message,
      type: "error"
    })
  }

  const showMessageError = (message) => {
    Alert.show({
      message,
      type: "error"
    })
  }

  const setValuesForEdit = async () => {
    try {

      const { data: responsable } = await DnerhsApi.get(`/instituciones/establecimientos/responsables/${params.id}`);

      setResponsableResponseData(responsable);

      let { institucionEstablecimiento } = responsable;

      const formValues = {
        nombreServicio:
          institucionEstablecimiento?.nombreServicio.id,
        tipoEstablecimiento:
          institucionEstablecimiento?.tipoEstablecimiento.id,
        apellidos: responsable.apellidos,
        cedulaIdentidad: responsable.cedulaIdentidad,
        email: responsable.email,
        nombres: responsable.nombres,
        telefono: responsable.telefono,
        cargo: responsable.cargo

      };

      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });

      setIsUpdate(true);

    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  };

  const onSubmit = async (data) => {

    let url = "/instituciones/establecimientos/responsables/";

    const payload = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedulaIdentidad: data.cedulaIdentidad,
      telefono: data.telefono,
      cargo: data.cargo,
      email: data.email
    };

    try {

      let message = "";

      if (isUpdate) {
        let payloadUpt = { ...responsableResponseData,  ...payload};

        console.log("merge")
        console.log(payloadUpt);
       
        await DnerhsApi.put(url, {
          ...payloadUpt,
        });

        message = "Datos actualizados exitosamente."

      } else {

        payload.institucionEstablecimiento = {
          nombreServicio: {
            id: data.nombreServicio
          },
          tipoEstablecimiento: {
              id: data.tipoEstablecimiento
          }
        }
       
        await DnerhsApi.post(url, {
          ...payload,
        });

        message = "Datos guardados exitosamente."
      }

      Alert.show({
        message,
        type: "success"
      })

      history.goBack();
    } catch (error) {     
      if(error.response.data.trace.includes('llave duplicada')){
        showMessageError("Registro con el mismo Establecimiento ya existe en la base de datos.");
      }else{
        showMessageError(error);
      }
      
    }
  }

  const handleFindDatosPersonales = async (event) => {
    let {target} = event;
    
    const { data } = await trackPromise(findByNumeroCedula(target.value));
    if (data) {
      setValue("nombres", data.nombres);
      setValue("apellidos", data.apellidos);
    }
  }

  return (
    <div className={classes.main}>
      <Grid item xs={12}>
        {isAddMode ? (
          <Typography
            align="center"
            variant="h5"
            color="primary"
            className={classes.form}
          >
            Actualización de Datos de Establecimiento
          </Typography>
        ) : (
          <Typography
            align="center"
            variant="h5"
            color="primary"
            className={classes.form}
          >
            Establecimiento y usuario responsable
          </Typography>
        )}
      </Grid>
      <div>
        <FormProvider {...methods}>
          <Paper>
            <form>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
              >
                <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="nombreServicio"
                    label="Nombre del Servicio"
                    options={nombreServicioOptions}
                    disabled={isReadOnly || isUpdate}
                  />
                </Grid>
                </Grid>
                <Grid item xs={6} className={classes.form}>

                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="tipoEstablecimiento"
                    label="Tipo de Establecimiento"
                    options={tipoEstablecimientoOptions}
                    disabled={isReadOnly || isUpdate}
                  />
                </Grid>
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <Typography align="center" variant="h6" color="primary">
                    Datos del Responsable
                  </Typography>
                </Grid>

                <Grid item xs={6} className={classes.form}>
                  <Grid item xs={12} className={classes.field}>
                    <FormInput
                      name="cedulaIdentidad"
                      label="Cédula de Identidad"
                      onBlur={handleFindDatosPersonales}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.field}>
                    <FormInput
                      name="nombres"
                      label="Nombres"
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.field}>
                    <FormInput
                      name="apellidos"
                      label="Apellidos"
                      disabled={isReadOnly}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={6} className={classes.form}>
                  <Grid item xs={12} className={classes.field}>
                    <FormInput
                      name="cargo"
                      label="Cargo"
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.field}>
                    <FormInput
                      name="telefono"
                      label="Teléfono"
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.field}>
                    <FormInput
                      name="email"
                      label="E-mail"
                      disabled={isReadOnly}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </FormProvider>
      </div>

      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        className={classes.form}
      >
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            onClick={() => { history.goBack() }}
          >
            Atrás
          </Button>
        </Grid>
        {(isAddMode || isUpdate) &&
          <Grid item className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </Button>
          </Grid>
        }
      </Grid>

    </div>)
};

export default Form;
