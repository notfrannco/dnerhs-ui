import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../api/DnerhsApi";
import FormInput from "../../../Controls/Input";
import FormSelect from "../../../Controls/Select";
import Alert from "../../../components/Alert";
import ResponseUtils from "../../../utils/ResponseUtils";
import history from "../../../utils/History";
import { useParams, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/Auth";
import Roles from "../../../constants/Roles";
import { getCarrerasProgramas } from "services/ConvenioService";
import { findByNumeroCedula } from "services/DatosPersonalesService";
import { trackPromise } from "react-promise-tracker";

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
  const [carreraOptions, setCarreraOptions] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [tutoresResponseData, setTutoresResponseData] = useState({});
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, setValue, reset } = methods;
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { hasRole } = useAuth();
  let { state } = useLocation();

  useEffect(() => {
    const load = () => {
      try {
        if (state?.edit || state?.readOnly) {
          setIsUpdate(state?.edit);
          setIsReadOnly(state?.readOnly);
          setValuesForEdit();
        } else {
          getServerData();
        }
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const getServerData = async () => {
    try {

      const { data: responseCarreraProgramaData } = await getCarrerasProgramas(params.convenioId);
      loadCarreraOptions(responseCarreraProgramaData);
    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  };

  const loadCarreraOptions = (carreras) => {
    setCarreraOptions(
      carreras.map((carrera) => ({
        label: carrera.carreraPrograma.descripcion,
        id: carrera.carreraPrograma.id,
      }))
    );
  }

  const setValuesForEdit = async () => {
    try {

      let { convenioTutorId } = params;

      const { data: tutoresResponseData } = await DnerhsApi.get(`/convenios/tutores/${convenioTutorId}`);

      setTutoresResponseData(tutoresResponseData);

      const { data: responseCarreraProgramaData } = await DnerhsApi.get(`/convenios/${tutoresResponseData?.convenio.id}/carreras-programas`, {
        params: { pageSize: 100 },
      });

      let { tutor } = tutoresResponseData;

      const formValues = {
        cedulaIdentidad: tutor.cedulaIdentidad,
        apellido: tutor.apellidos,
        nombre: tutor.nombres,
        email: tutor.email,
        carrera: tutor.carrera.id,
        numeroRegistroProfesional: tutor.numeroRegistroProfesionalVigente,
        materia: tutor.materia,
        curso: tutor.curso
      };

      Object.keys(formValues).forEach((field) => setValue(field, formValues[field]));

      loadCarreraOptions(responseCarreraProgramaData);

    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  }

  const onSubmit = async (data) => {

    if (data.carrera === "") {
      showMessageError("El campo carrera es dato requerido");
      return;
    }

    let url = "/convenios/tutores";

    const tutorDataForm = {
      cedulaIdentidad: data.cedulaIdentidad,
      apellidos: data.apellido,
      nombres: data.nombre,
      email: data.email,
      carrera: { id: data.carrera },
      numeroRegistroProfesionalVigente: data.numeroRegistroProfesional,
      materia: data.materia,
      curso: data.curso
    };

    try {

      let message = "";

      if (isUpdate) {
        let payloadUpt = { ...tutoresResponseData };

        payloadUpt.tutor = tutorDataForm;

        await DnerhsApi.put(url, {
          ...payloadUpt,
        });

        message = "Datos guardados exitosamente."

      } else {
        let payloadNew = {
          convenio: {
            id: params.convenioId,
          },
          tutor: tutorDataForm
        }

        await DnerhsApi.post(url, {
          ...payloadNew,
        });

        message = "Datos actualizados exitosamente."
      }

      Alert.show({
        message,
        type: "success"
      })

      history.goBack();
    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  }

  const handleFindDatosPersonales = async (event) => {
    let { target } = event;

    const { data } = await trackPromise(findByNumeroCedula(target.value));
    if (data) {
      setValue("nombre", data.nombres);
      setValue("apellido", data.apellidos);
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

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Tutor
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
                  <FormInput
                    type="number"
                    name="cedulaIdentidad"
                    label="Cédula de Identidad"
                    onBlur={handleFindDatosPersonales}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="apellido"
                    label="Apellidos"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                      name="carrera"
                      label="Carrera"
                      disabled={isReadOnly}
                      options={carreraOptions}
                    />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="numeroRegistroProfesional"
                    label="Nro. Registro Profesional"
                    disabled={isReadOnly}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                    <FormInput
                    name="nombre"
                    label="Nombres"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="email" label="Email" disabled={isReadOnly} />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="materia"
                    label="Materia"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    type="number"
                    name="curso"
                    label="Curso"
                    disabled={isReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            onClick={() => history.goBack()}
          >
            Atrás
          </Button>
        </Grid>
        {hasRole(Roles.ROLE_USER) && (
          <Grid item className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Form;