import React, { useState, useEffect } from "react";
import {
  Button,
  Grid
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import "react-toastify/dist/ReactToastify.css";
import FormInput from "../../Controls/Input";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import Alert from "../../components/Alert";
import history from "../../utils/History";
import useAuth from "hooks/Auth";

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

const validationSchema = yup.object().shape({
  descripcion: yup.string().required("El campo descripción es requerido")
});

const URL_BASE_CARRERAS = "/carreras-programas/"

const Form = () => {
  const classes = useStyles();
  const [carreraResponse, setCarreraResponse] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const { carreraId } = useParams();
  const methods = useForm({ resolver: yupResolver(validationSchema) });
  const { handleSubmit, errors, setValue } = methods;

  useEffect(() => {
    if (carreraId) {
      setIsUpdate(true);
      setValuesForEdit();
    }

  }, [])

  const setValuesForEdit = async () => {
    try {

      const { data: carreraResponseData } = await DnerhsApi.get(URL_BASE_CARRERAS + carreraId);

      setCarreraResponse(carreraResponseData);

      const formValues = {
        descripcion: carreraResponseData.descripcion,
      };

      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  }

  const onSubmit = async (data) => {
  
    let message = "";

    let payload = {
        descripcion: data.descripcion
    };

    try {

      if (isUpdate) {
        payload = { ...carreraResponse, ...payload };

        DnerhsApi.put(URL_BASE_CARRERAS, {
          ...payload,
        });

        message = "Datos actualizados exitosamente."

      } else {

        await DnerhsApi.post(URL_BASE_CARRERAS, {
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
      console.log("error catch");
    }
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Carreras / Programas
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
                  <FormInput name="descripcion" label="Descripción" errorobj={errors} required />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <Grid item container direction="row" justifyContent="flex-end" alignItems="center">
                    <Grid item className={classes.field}>
                      <Button
                        variant="contained"
                        color="default"
                        onClick={() => history.goBack()}
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
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>

    </div>
  );
};

export default Form;
