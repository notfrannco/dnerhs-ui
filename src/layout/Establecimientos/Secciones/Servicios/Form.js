import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  FormLabel,
  TextField,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../../api/DnerhsApi";
import { useParams, useLocation } from "react-router-dom";
import Alert from "../../../../components/Alert";
import ResponseUtils from "../../../../utils/ResponseUtils";
import history from "../../../../utils/History";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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

const initialValuesRadioFields = {
  internadosAnio: {
    label: "Número de pacientes internados por año",
    cantidad: 0,
    valor: "no",
  },
  girosCama: {
    label: "Número de giros cama por año",
    cantidad: 0,
    valor: "no",
  },
  nacimientosAnio: {
    label: "Número de nacimientos por año",
    cantidad: 0,
    valor: "no",
  },
  cirugiasMayoresAnio: {
    label: "Número de cirugías mayores realizadas por año",
    cantidad: 0,
    valor: "no",
  },
  especialidadPediatria: {
    label: "Número de pacientes atendidos en la especialidad de Pediatría por año",
    cantidad: 0,
    valor: "no",
  },
  especialidadClinica: {
    label: "Número de pacientes atendidos en la especialidad de Clinica Médica por año",
    cantidad: 0,
    valor: "no",
  },
  especialidadCirugia: {
    label: "Número de pacientes atendidos en la especialidad de Cirugía por año",
    cantidad: 0,
    valor: "no",
  },
  especialidadGinecobstetricia: {
    label: "Número de pacientes atendidos en la especialidad de Ginecología y Obstetricia por año",
    cantidad: 0,
    valor: "no",
  },
  especialidadMedicinaFamiliar: {
    label: "Número de pacientes atendidos en la especialidad de Medicina Familiar por año",
    cantidad: 0,
    valor: "no",
  },
  auxiliaresLaboratorio: {
    label: "Número de servicio de auxiliares de laboratorio por año",
    cantidad: 0,
    valor: "no",
  },
  auxiliaresImagenes: {
    label: "Número de servicio de auxiliares de imágenes por año",
    cantidad: 0,
    valor: "no",
  },
}

const Form = () => {
  const classes = useStyles();
  const [servicioResponseData, setServicioResponseData] = useState({});
  const [radioFields, setRadioFields] = useState(initialValuesRadioFields);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit } = methods;
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
      const responseServicios = await DnerhsApi.get(
        `/instituciones/establecimientos/${params.establecimientoId}/servicios`
      );

      let { data } = responseServicios;

      if (data) {
        let values = { ...radioFields };
        for (let key in radioFields) {
          if (data[key]) {
            values[key].valor = "si";
          } else {
            values[key].valor = "no";
          }
          values[key].cantidad = String(
            data[key + "Cantidad"]
          );
        }

        setRadioFields(values);
        setServicioResponseData(data);
        setIsUpdate(true);
      }
    } catch (error) {
      console.log(error);
      showMessageError(error);
    }
  };

  const onSubmit = async (data) => {
    let payload = {
      institucionEstablecimiento: {
        id: params.establecimientoId,
      }
    };
    try {
      let url = "/instituciones/establecimientos/servicios";
      let message;

      Object.keys(radioFields).forEach(key => {
        let radioField = radioFields[key];
        payload[key] = radioField.valor == "si";
        payload[key + "Cantidad"] = parseInt(radioField.cantidad);
      })

      if (isUpdate) {
        payload.id = servicioResponseData.id;
        await DnerhsApi.put(url, {
          ...payload,
        });
        message = "Datos guardados exitosamente.";

      } else {
        await DnerhsApi.post(url, {
          ...payload,
        });
        message = "Datos actualizados exitosamente.";
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

  const handleRadioChange = (key, value) => {
    setRadioFields((prevState) => {
      let newState = { ...prevState };
      let newValue = newState[key]["valor"] = value;
      if (newValue === 'no') {
        newState[key]["cantidad"] = 0;
      }
      return newState;
    });
  };

  const handleCantidadChange = (key, value) => {
    setRadioFields((prevState) => {
      let newState = { ...prevState };
      newState[key]["cantidad"] = parseInt(value);
      return newState;
    });
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
         Cartera de Servicios
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
        <Grid container direction="row" spacing={5}>
            {Object.keys(radioFields).map((key) => {
              let field = radioFields[key];
              return (
                <Grid key={key} item md={6} xs={12}>
                  <Card>
                    <CardContent>
                      <Grid container direction="row">
                        <Grid item xs={12} className={classes.field}>
                          <FormLabel>{field.label}</FormLabel>
                          <RadioGroup
                            label={field.label}
                            value={field.valor}
                            onChange={(e) =>
                              handleRadioChange(key, e.target.value)
                            }
                            name="radio-button-group"
                          >
                            <FormControlLabel
                              value="si"
                              control={<Radio />}
                              label="Si"
                              disabled={isReadOnly}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label="No"
                              disabled={isReadOnly}
                            />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <TextField
                            name={field.key}
                            label="cantidad"
                            type="number"
                            value={field.cantidad}
                            onChange={(e) =>
                              handleCantidadChange(
                                key,
                                e.target.value
                                  .replace(/[^0-9\b]/g, "")
                                  .replace("", "0")
                              )
                            }
                            disabled={isReadOnly || field.valor === "no"}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                </Grid>

              );
            })}
          </Grid>
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
          ((
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Guardar
              </Button>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default Form;
