import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../api/DnerhsApi";
import FormInput from "../../../Controls/Input";
import Alert from "../../../components/Alert";
import ResponseUtils from "../../../utils/ResponseUtils";
import history from "../../../utils/History";
import { useParams, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/Auth";
import Tooltip from "@material-ui/core/Tooltip";
import { findById } from "../../../constants/Meses";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Checkbox from '@material-ui/core/Checkbox';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from '@material-ui/icons/Clear';
import { trackPromise} from 'react-promise-tracker';

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
  const [listPracticas, setListPracticas] = useState([]);
  const [listPracticasOriginal, setListPracticasOriginal] = useState([]);
  const [cedulaIdentidad, setCedulaIdentidad] = useState("");
  const params = useParams();
  const methods = useForm({});
  const { handleSubmi, setValue } = methods;
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { hasRole, hasAnyRole } = useAuth();
  let { state } = useLocation();

  useEffect(() => {
    const load = () => {
      try {
        if (state?.edit || state?.readOnly) {
          setIsReadOnly(state.readOnly);
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
      try {
        let { convenioPracticaId } = params;
  
        const { data: practicaResponseData } = await DnerhsApi.get(
          `/convenios/practicas/${convenioPracticaId}`
        );
  
         const formValues = {
          carrera: practicaResponseData.convenioCarrera?.carreraPrograma?.descripcion,
          materia: practicaResponseData.materia,
          curso: practicaResponseData.curso,
          semestre: practicaResponseData.semestre,
          observacion: practicaResponseData.observacion,
        };
  
        Object.keys(formValues).forEach((field) => {
          setValue(field, formValues[field]);
        });
        practicaResponseData.practicaDetalleList.forEach((k)=>{
          k.practicaDetalleHorarioList.forEach((ho)=>{
            console.log(ho);
            if(ho.dia=="1"){ 
              k.lunes=true;
            }
            if(ho.dia=="2"){ 
              k.martes=true;
            }
            if(ho.dia=="3"){ 
              k.miercoles=true;
            }
            if(ho.dia=="4"){ 
              k.jueves=true;
            }
            if(ho.dia=="5"){ 
              k.viernes=true;
            }
            if(ho.dia=="6"){ 
              k.sabado=true;
            }
            if(ho.dia=="7"){ 
              k.domingo=true;
            }
          });
        });
        let { practicaDetalleList } = practicaResponseData;
        
        setListPracticas(practicaDetalleList);
        setListPracticasOriginal(practicaDetalleList);
      } catch (error) {
        console.log(error);
        if (error.response) {
          showServerError(error);
        } else {
          showMessageError(error);
        }
      }

    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  };

  const handleSearchEstudiante = () => {
    if (cedulaIdentidad) {
      let listPracticaFilter = listPracticasOriginal.filter(
        item => item.convenioEstudiante.estudiante.cedulaIdentidad == cedulaIdentidad
      );
      setListPracticas(listPracticaFilter);
    }else {
      setListPracticas(listPracticasOriginal);
    }
  }

  const showServerError = (error) => {
    let message = "Ocurrió un error inesperado, por favor vuelva a reintentar";
    if (error.response) {
      message = ResponseUtils.getMessageError(error.response);
    }

    Alert.show({
      message,
      type: "error",
    });
  };

  const showMessageError = (message) => {
    Alert.show({
      message,
      type: "error",
    });
  };

  const handleChangeConfirmacion = async (event, row) => {
    try {

      await trackPromise( DnerhsApi.post(
        `/convenios/practicas/confirmacion/${row.id}?confirmacion=${event.target.checked}`
      ));
     
      Alert.show({
        message: "Practica confirmada exitosamente.",
        type: "success",
      });

      trackPromise(getServerData());
    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      } else {
        showMessageError(error);
      }
    }
  }

  const checkDayFormat = (day) => {
    return day ? (
      <CheckIcon color="secondary" />
    ) : (
      <CloseIcon color="primary" />
    );
  }

  const handleNumeroDocumentoKeyPress = (event) => {
    if(event.key === 'Enter'){
     handleSearchEstudiante();
    }
  }

  const handleResetSearch = () => {
    setCedulaIdentidad("");
    setListPracticas(listPracticasOriginal);
  }

  const handleChangeCedulaIdentidad = (event) => {
    setCedulaIdentidad(event.target.value)
  }

  return (
    <>
      <Paper>
        <Box padding={5}>
          <Grid item xs={12}>
            <Typography align="center" variant="h5" color="primary">
              Confirmación de Prácticas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormProvider {...methods}>
              <form>
                <Grid container direction="row">
                  <Grid item xs={6}>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        name="carrera"
                        label="Carrera"
                        disabled={isReadOnly}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        name="materia"
                        label="Materia"
                        disabled={isReadOnly}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        type="number"
                        name="curso"
                        label="Curso"
                        disabled={isReadOnly}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        type="number"
                        name="semestre"
                        label="Semestre"
                        disabled={isReadOnly}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="h6" color="primary">
              Estudiantes
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            className={classes.field}
          >
            <TextField
              fullWidth
              value={cedulaIdentidad}
              defaulValue=""
              onChange={handleChangeCedulaIdentidad}
              onKeyPress={handleNumeroDocumentoKeyPress}
              label="Cédula de identidad"
              InputProps={{
                endAdornment: (
                  <>
                  <InputAdornment position="end" onClick={handleResetSearch}>
                  <IconButton>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
                  <InputAdornment position="end" onClick={handleSearchEstudiante}>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                  </>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="Datos estadisticos">
                  <TableHead>
                    <TableRow>
                    <TableCell align="left">C.I.</TableCell>
                      <TableCell align="left">Año</TableCell>
                      <TableCell align="left">Alumno</TableCell>                    
                      <TableCell align="left">D</TableCell>
                      <TableCell align="left">L</TableCell>
                      <TableCell align="left">M</TableCell>
                      <TableCell align="left">X</TableCell>
                      <TableCell align="left">J</TableCell>
                      <TableCell align="left">V</TableCell>
                      <TableCell align="left">S</TableCell>
                      <TableCell align="left">Total Horas</TableCell>
                      <TableCell align="left">Tutor</TableCell>
                      <TableCell align="left">Establecimiento</TableCell>
                      <TableCell align="left">Confirmado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listPracticas.length > 0 ? (
                      listPracticas.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            {row.convenioEstudiante?.estudiante.cedulaIdentidad}
                          </TableCell>
                          <TableCell align="left">{row.anio}</TableCell>
                          <TableCell align="left">
                          {row.convenioEstudiante?.estudiante.nombres}&nbsp;{row.convenioEstudiante?.estudiante.apellidos}
                        </TableCell>
                          <TableCell align="left">
                            {checkDayFormat(row.domingo)}
                          </TableCell>
                          <TableCell align="left">
                            {checkDayFormat(row.lunes)}
                          </TableCell>
                          <TableCell align="left">
                            {checkDayFormat(row.martes)}
                          </TableCell>
                          <TableCell align="left">
                            {checkDayFormat(row.miercoles)}
                          </TableCell>
                          <TableCell align="left">
                            {checkDayFormat(row.jueves)}
                          </TableCell>
                          <TableCell align="left">
                            {checkDayFormat(row.viernes)}
                          </TableCell>
                          <TableCell align="left">
                            {checkDayFormat(row.sabado)}
                          </TableCell>                          
                          <TableCell align="left">
                            {row.totalHoras + " hs"}
                          </TableCell>
                          <TableCell align="left">
                          {row.convenioTutor?.tutor?.nombres}&nbsp;{ row.convenioTutor?.tutor?.apellidos}
                          </TableCell>
                          <TableCell align="left">
                            {row.establecimiento?.nombreServicio.nombre}
                          </TableCell>
                          <TableCell align="left">
                            <Tooltip title="Eliminar" aria-label="eliminar">
                              <Checkbox
                                checked={row.confirmacion}
                                onChange={(event) =>
                                  handleChangeConfirmacion(event, row)
                                }
                                inputProps={{
                                  "aria-label": "primary checkbox",
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={15}>
                          <Typography
                            align="center"
                            color="primary"
                            variant="body1"
                          >
                            No hay datos para mostrar
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box paddingTop={3}>
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
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default Form;
