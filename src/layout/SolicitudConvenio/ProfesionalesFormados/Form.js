import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Grid
} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import InputAdornment from '@material-ui/core/InputAdornment';

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
  const [profesionalesFormadosResponseData, setProfesionalesFormadosResponseData] = useState({});
  const [listDatosEstadisticos, setListDatoEstadisticos] = useState([]);
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, setValue, reset } = methods;
  const methodsDatosEstadisticos = useForm({});
  const { handleSubmit: handleSubmitDatosEstadistica, reset: resetDatosEstadisticosForm } = methodsDatosEstadisticos;
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
          getServerData({ convenioId: params.convenioId });
        }


      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const getServerData = async ({ convenioId }) => {
    try {

      const { data: responseCarreraProgramaData } = await DnerhsApi.get(`/convenios/${convenioId}/carreras-programas`, {
        params: { pageSize: 100 },
      });

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
    if (carreras) {
      setCarreraOptions(
        carreras.map((carrera) => ({
          label: carrera.carreraPrograma.descripcion,
          id: carrera.carreraPrograma.id,
        }))
      );
    }
  }

  const setValuesForEdit = async () => {
    try {

      let { convenioProfesionalesFormadosId } = params;

      const { data: profesionalesFormadosResponseData } = await DnerhsApi.get(`/convenios/profesionales-formados/${convenioProfesionalesFormadosId}`);

      setProfesionalesFormadosResponseData(profesionalesFormadosResponseData);

      await getServerData({ convenioId: profesionalesFormadosResponseData.convenio.id })

      const formValues = {
        carrera: profesionalesFormadosResponseData.carrera.id,
        duracionCicloFormativo: profesionalesFormadosResponseData.duracionCicloFormativo,
        titulacionOtorgada: profesionalesFormadosResponseData.titulacionOtorgada,
      };

      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });

      setListDatoEstadisticos(profesionalesFormadosResponseData.listaTotalesProfesionalesAnios);

    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  }

  const onSubmitDatosEstadisticos = async (data) => {

    if (data.anio === "" || data.numeroEgresados === "" || data.numeroIngresados === "") {
      showMessageError("Por favor ingrese los datos, todos los campos son requeridos.");
      return;
    }

    let listDatosEstadisticosFilter = listDatosEstadisticos.filter(item => item.anio == data.anio);

    if (listDatosEstadisticosFilter.length > 0) {
      showMessageError("Ya existen datos estadisticos para el año " + data.anio);
      return;
    }

    setListDatoEstadisticos([...listDatosEstadisticos, data]);
    resetDatosEstadisticosForm();
  }


  const onSubmit = async (data) => {

    if (data.carrera === "") {
      showMessageError("El campo carrera es dato requerido");
      return;
    }

    let url = "/convenios/profesionales-formados ";

    const payload = {
      titulacionOtorgada: data.titulacionOtorgada,
      duracionCicloFormativo: data.duracionCicloFormativo,
      carrera: { id: data.carrera },
      listaTotalesProfesionalesAnios: listDatosEstadisticos
    };

    try {

      let message = "";

      if (isUpdate) {

        let payloadUpt = { ...profesionalesFormadosResponseData, ...payload };

        await DnerhsApi.put(url, {
          ...payloadUpt,
        });

        message = "Datos guardados exitosamente."

      } else {
        payload.convenio = {
          id: params.convenioId,
        }

        await DnerhsApi.post(url, {
          ...payload,
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

  const handleDeleteDatoEstadistico = (index) => {
    let listCopy = [...listDatosEstadisticos];
    listCopy.splice(index, 1);

    setListDatoEstadisticos(listCopy)
  }

  return (
    <>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Datos estadisticos de estudiantes
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormProvider {...methods}>
          <form>
            <Grid
              container
              direction="row"
            >
              <Grid item xs={6}>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="carrera"
                    label="Carrera"
                    disabled={isReadOnly}
                    options={carreraOptions}
                  />
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput type="number" name="duracionCicloFormativo" 
                    label="Duración ciclo formativo" 
                    helperText="Duración del ciclo formativo en años"
                    disabled={isReadOnly} />
                </Grid>
              </Grid>


              <Grid item xs={12}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="titulacionOtorgada" label="Titulación Otorgada" disabled={isReadOnly} />
                </Grid>

              </Grid>
            </Grid>

          </form>
        </FormProvider>
      </Grid>

      <Grid item xs={12}>
        <Box paddingTop={3}>
          <FormProvider {...methodsDatosEstadisticos}>
            <form>
              <Grid
                container
                direction="row"
              >
                {hasRole(Roles.ROLE_USER) &&
                  <Grid item xs={4}>
                    <Grid item xs={12} className={classes.field}>
                      <Typography align="left" variant="h6" color="primary">
                        Nuevo Dato Estadístico
                      </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput name="anio" label="Año" type="number" disabled={isReadOnly} />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput name="numeroIngresados" type="number"  label="Número de ingresados en 1er Curso." disabled={isReadOnly} />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput name="numeroEgresados" type="number"  label="Número de egresados" disabled={isReadOnly} />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput name="porcentajeDesercion" type="number" 
                      label="Porcentaje Deserción" 
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      disabled={isReadOnly} />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container direction="row" justifyContent="flex-end" alignContent="flex-end" >
                        {
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={!hasRole(Roles.ROLE_USER)}
                            onClick={handleSubmitDatosEstadistica(onSubmitDatosEstadisticos)}
                            className={classes.field}
                          >
                            Agregar
                          </Button>
                        }
                      </Grid>
                    </Grid>
                  </Grid>
                }

                <Grid item xs={hasRole(Roles.ROLE_USER) ? 8 : 12}>
                  <Grid item xs={12} className={classes.field}>
                    <Typography align="center" variant="h6" color="primary">
                      Estadísticas de los últimos 5 años
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer component={Paper}>
                      <Table aria-label="Datos estadisticos">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Año</TableCell>
                            <TableCell align="right">Nro. Ingresados 1er Curso</TableCell>
                            <TableCell align="right">Nro. Egresados</TableCell>
                            <TableCell align="right">Porcentaje Deserción</TableCell>
                            {hasRole(Roles.ROLE_USER) &&
                              <TableCell align="center">Acción</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listDatosEstadisticos.sort((a, b) =>  (a.anio > b.anio ? -1 : 1)).map((row, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">{row.anio}</TableCell>
                              <TableCell align="right">{row.numeroIngresados}</TableCell>
                              <TableCell align="right">{row.numeroEgresados}</TableCell>
                              <TableCell align="right">{row.porcentajeDesercion}</TableCell>
                              {hasRole(Roles.ROLE_USER) &&
                                <TableCell align="center">
                                  <Tooltip title="Eliminar" aria-label="eliminar">
                                    <IconButton
                                      size="small"
                                      aria-label="eliminar"
                                      color="secondary"
                                      onClick={() => handleDeleteDatoEstadistico(index)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box paddingTop={3}>
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
            {hasRole(Roles.ROLE_USER) &&
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
        </Box>
      </Grid>
    </>
  );
};

export default Form;