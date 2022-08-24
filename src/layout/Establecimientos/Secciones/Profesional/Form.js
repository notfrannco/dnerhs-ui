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
  medicosMedicinaClinicas: {
    label: "Medicina Clínica Médica",
    cantidad: "0",
    valor: "no",
  },
  medicosPediatras: {
    label: "Pediatría",
    cantidad: "0",
    valor: "no",
  },
  medicosCirujanos: {
    label: "Cirugía",
    cantidad: "0",
    valor: "no",
  },
  medicosGinecobstetras: {
    label: "Ginecología y Obstetricia",
    cantidad: "0",
    valor: "no",
  },
  medicosMedicinaFamiliar: {
    label: "Medicina Familiar",
    cantidad: "0",
    valor: "no",
  },
  enfermeros: {
    label: "Lic. en Enfermería",
    cantidad: "0",
    valor: "no",
  },
  odontologos: {
    label: "Odontólogos",
    cantidad: "0",
    valor: "no",
  },
  bioquimicos: {
    label: "Bioquímicos",
    cantidad: "0",
    valor: "no",
  },
  kinesiologos: {
    label: "Lic. en Kinesiología y Fisioterapia",
    cantidad: "0",
    valor: "no",
  },
  farmaceuticos: {
    label: "Lic. en Farmacia",
    cantidad: "0",
    valor: "no",
  },
  nutricionistas: {
    label: "Nutricionistas",
    cantidad: "0",
    valor: "no",
  },
  psicologos: {
    label: "Psicólogos",
    cantidad: "0",
    valor: "no",
  },
  fonoaudiologos: {
    label: "Fonoaudiólogos",
    cantidad: "0",
    valor: "no",
  },
  instrumentadores: {
    label: "Instrumentador Quirúrgico",
    cantidad: "0",
    valor: "no",
  },
}

const Form = () => {
  const classes = useStyles();
  const [isUpdate, setIsUpdate] = useState(false);
  const [responseId, setResponseId] = useState();
  const [radioFields, setRadioFields] = useState(initialValuesRadioFields);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, } = methods;
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
      const {data : responseProfesionalData} = await DnerhsApi.get(
        `/instituciones/establecimientos/${params.establecimientoId}/profesionales`
      );

      if (responseProfesionalData) {
        let values = { ...radioFields };
        for (let key in radioFields) {
          if (responseProfesionalData[key]) {
            values[key].valor = "si";
          } else {
            values[key].valor = "no";
          }
          values[key].cantidad = responseProfesionalData[key + "Cantidad"];
        }

        setRadioFields(values);
        setIsUpdate(true);
        setResponseId(responseProfesionalData.id);
      } 
    } catch (error) {
      console.log(error);
      showMessageError(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      let message;
      let url = "/instituciones/establecimientos/profesionales";

      let payload = {
        institucionEstablecimiento: {
          id: params.establecimientoId,
        }
      };
      for (let key in radioFields) {
        payload[key] = radioFields[key].valor == "si";
        payload[key + "Cantidad"] = parseInt(radioFields[key].cantidad);
      }

      if (isUpdate) {
        payload.id = responseId;
        await DnerhsApi.put(url, {
          ...payload,
        });
        message = "Datos actualizados exitosamente.";
      } else {
        await DnerhsApi.post(url, {
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
    
  const handleRadioChange = (key, value) => {
    setRadioFields((prevState) => {
      let newState = { ...prevState };
      let newValue = newState[key]["valor"] = value;
      if (newValue=== 'no'){
        newState[key]["cantidad"] = "0";
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
          Profesionales del Campo de Práctica
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
        <Grid container direction="row" spacing={5}>
          {Object.keys(radioFields).map((key) => {
            let field = radioFields[key];
            return (
              <Grid key={key} item md={4} xs={12}>
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
                          type="number"
                          label="cantidad"
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
            onClick = {() => history.goBack()}
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
