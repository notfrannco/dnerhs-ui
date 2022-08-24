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
  camasClinicaMedica: { label: "Camas Clínica Médica", cantidad: "0", valor: "no" },
  camasPediatria: { label: "Camas Pediatría", cantidad: "0", valor: "no" },
  camasCirugia: { label: "Camas Cirugía", cantidad: "0", valor: "no" },
  camasGiniecoObstetricia: { label: "Camas Ginecología y Obstetricia", cantidad: "0", valor: "no" },
  camasUrgencia: { label: "Camas Urgencias", cantidad: "0", valor: "no" },
  camasUnidadTerapiaIntensiva: { label: "Camas UTI", cantidad: "0", valor: "no" },
  consultoriosMedicos: {
    label: "Consultorios Médicos",
    cantidad: 0,
    valor: "no",
  },
  consultorioClinicaMedica: {
    label: "Consultorios Clínica Médica",
    cantidad: 0,
    valor: "no",
  },
  consultorioPediatria: {
    label: "Consultorios Pediatría",
    cantidad: 0,
    valor: "no",
  },
  consultorioCirugia: {
    label: "Consultorios Cirugía",
    cantidad: 0,
    valor: "no",
  },
  consultorioGinecoObstetricia: {
    label: "Consultorios Ginecología y Obstetricía",
    cantidad: 0,
    valor: "no",
  },
  laboratorios: {
    label: "Laboratorios",
    cantidad: 0,
    valor: "no"
  },
  salasRxMamografia: {
    label: "Salas de Rx - Mamografía",
    cantidad: 0,
    valor: "no",
  },
  consultorioOdontologicos: {
    label: "Consultorios odontólogicos",
    cantidad: 0,
    valor: "no",
  },
  consultorioPsicologia: {
    label: "Consultorios para Psicología",
    cantidad: 0,
    valor: "no",
  },
  consultorioNutricion: {
    label: "Consultorios para Nutrición",
    cantidad: 0,
    valor: "no",
  },
  consultorioFisioterapia: {
    label: "Consultorios para Fisioterapia",
    cantidad: 0,
    valor: "no",
  },
  consultorioKinesiologia: {
    label: "Consultorios para Kinesiología",
    cantidad: 0,
    valor: "no",
  },
  farmacias: {
    label: "Farmacias",
    cantidad: 0,
    valor: "no"
  },
  quirofanos: {
    label: "Quirófanos",
    cantidad: 0,
    valor: "no"
  },
  salasParto: {
    label: "Salas de parto",
    cantidad: 0,
    valor: "no"
  },
  aulas: {
    label: "Aulas",
    cantidad: 0,
    valor: "no"
  },
  bibliotecas: {
    label: "Biblioteca o área de lectura con acceso a internet",
    cantidad: 0,
    valor: "no",
  },
  areasDescanso: {
    label: "Áreas de Descanso",
    cantidad: 0,
    valor: "no"
  },
  vestidores: {
    label: "Vestidores",
    cantidad: 0,
    valor: "no"
  },
  comedores: {
    label: "Comedor",
    cantidad: 0,
    valor: "no"
  },
};

const Form = () => {
  const classes = useStyles();
  const [isUpdate, setIsUpdate] = useState(false);
  const [responseId, setResponseId] = useState();
  const [radioFields, setRadioFields] = useState(initialValuesRadioFields);
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
      const responseInfra = await DnerhsApi.get(
        `/instituciones/establecimientos/${params.establecimientoId}/infraestructura`
      );

      if (responseInfra.data) {
 
        let values = { ...radioFields };
        for (let key in radioFields) {
          if (responseInfra.data[key]) {
            values[key].valor = "si";
          } else {
            values[key].valor = "no";
          }

          values[key].cantidad = String(responseInfra.data[key + "Cantidad"]);
        }
        setRadioFields(values);
        setIsUpdate(true);
        setResponseId(responseInfra.data.id);
      }
    } catch (error) {
      console.log(error);
      showMessageError(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      let message;

      let payload = {
        institucionEstablecimiento: {
          id: params.establecimientoId,
        },
      };
      for (let key in radioFields) {
        payload[key] = radioFields[key].valor == "si";
        payload[key + "Cantidad"] = parseInt(radioFields[key].cantidad);
      }

      if (isUpdate) {
        payload.id = responseId;
        let url = "/instituciones/establecimientos/infraestructura";
        const response = await DnerhsApi.put(url, {
          ...payload,
        });
        message = "Datos actualizados exitosamente.";

      } else {
        let url = "/instituciones/establecimientos/infraestructura";
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
  }

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
          Infraestructura
        </Typography>
      </Grid>
      <FormProvider {...methods}>
        <Grid container direction="row" spacing={5}>
          {Object.keys(radioFields).map((key) => {
            let field = radioFields[key];
            return (
              <Grid item md={6} xs={12} key={key}>
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
                          value={field.cantidad}
                          onChange={(e) =>
                            handleCantidadChange(
                              key,
                              e.target.value
                                .replace(/[^0-9\b]/g, "")
                                .replace("", "0")
                            )
                          }
                          disabled={isReadOnly || field.valor === "no" }
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
          <Grid item className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </Button>
          </Grid>}
      </Grid>
    </div>
  );
};

export default Form;
