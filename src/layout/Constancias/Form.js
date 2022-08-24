import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Alert from "../../components/Alert";
import history from "../../utils/History";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DnerhsApi, { CancelToken } from "api/DnerhsApi";
import { getSedeSeleccionada } from "services/UsuarioService";
import { getAll } from "services/CarreraProgramaService"
import { trackPromise } from 'react-promise-tracker';
import AlertMUI from '@material-ui/lab/Alert';
import { findById } from "constants/Meses";

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
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [estudiante, setEstudiante] = useState();
  const [sedeActual, setSedeActual] = useState();
  const [carrera, setCarrera] = useState();
  const [carrerasOptions, setCarreraOptions] = useState([]);
  const [practicas, setPracticas] = useState([]);
  const [warningMessage, setWarningMessage] = useState();

  useEffect(() => {
    let institucionFormadora = getSedeSeleccionada();
    setSedeActual(institucionFormadora);
  }, []);
  

  const handleChangeNumeroDocumento = (event) => {
    setNumeroDocumento(event.target.value);
  };

  const handleSelectCarrera = (event, newValue) => {
    setCarrera(newValue);
  }

  const handleBuscarEstudiante = async () => {

    setWarningMessage();

    let source = CancelToken.source();
    try {
      let url = `/constancias/listado-practicas?carreraId=${carrera.id}&cedula=${numeroDocumento}&formadoraId=${sedeActual.formadora.id}`;

      const { data } = await trackPromise(DnerhsApi(url, {
        cancelToken: source.token,
      }));

      if (data && data.length > 0) {
        setPracticas(data);

        let { estudiante } = data[0].practicaDetalle.convenioEstudiante;
        setEstudiante(estudiante);
      } else {
        setEstudiante();
        setCarrera();
        setPracticas([]);
        setWarningMessage("¡No se encontraron datos para la búsqueda!")
      }

    } catch (error) {
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const handleConfirmar = async () => {

    try {
      let url = `/constancias`;

      let payload = {
        apellidos: estudiante.apellidos,
        cedulaIdentidad: estudiante.cedulaIdentidad,
        nombres: estudiante.nombres,
        carrera: carrera,
        nacionalidad: estudiante.nacionalidad,
        institucionFormadora : sedeActual,
        constanciaDetalleList: practicas.map(
          item => {
            let { id, ...rest } = item;
            return rest;
          }
        )
      };

      await trackPromise(DnerhsApi.post(url, {
        ...payload,
      }));

      Alert.show(
        {
          message: "Autorización exitosa.",
          type: "success"
        }
      )
      history.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();

  }, []);

  const getData = async () => {
    try {
      const { data } = await getAll();
      setCarreraOptions(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Autorización para gestión de constancia por estudiante
        </Typography>
      </Grid>
      <div>
        <Grid container direction="row">
          <Grid item xs={12} md={5} className={classes.form}>
            <TextField
              label="Ingrese el número de documento para la búsqueda"
              id="filled-start-adornment"
              variant="outlined"
              fullWidth={true}
              value={numeroDocumento}
              onChange={handleChangeNumeroDocumento}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.form}>
            <Autocomplete
              fullWidth
              onChange={handleSelectCarrera}
              options={carrerasOptions}
              getOptionLabel={(item) => item.descripcion}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Seleccionar carrera"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={1} className={classes.form}>
            <Button
              variant="contained"
              color="primary"
              className={classes.form}
              disabled={!(numeroDocumento && carrera)}
              onClick={handleBuscarEstudiante}
            >
              Buscar
            </Button>

          </Grid>
        </Grid>
      </div>
      <Grid container className={classes.form}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            color="primary"
            align="left"
            className={classes.title}
          >
            {estudiante && estudiante.nombres + " " + estudiante.apellidos}
          </Typography>
        </Grid>
        {warningMessage &&
          <Grid item xs={12}>
            <AlertMUI severity="warning">No se encontraron datos para la búsqueda </AlertMUI>
          </Grid>
        }
        <Grid item xs={12}>
          <Typography align="center" variant="h6" color="primary">
            Prácticas realizadas
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Carrera/Programa</TableCell>
                <TableCell align="left">Materia</TableCell>
                <TableCell align="left">Semestre</TableCell>
                <TableCell align="left">Curso</TableCell>
                <TableCell align="left">Año</TableCell>
                <TableCell align="left">Total Horas</TableCell>
                <TableCell align="left">CI Tutor</TableCell>
                <TableCell align="left">Tutor</TableCell>

                <TableCell align="left">Establecimiento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {practicas.length > 0 ?
                practicas.map((item, key) => (
                  <TableRow key={item.id}>
                    <TableCell align="left">{item.convenioCarrera.carreraPrograma.descripcion}</TableCell>
                    <TableCell align="left">{item.materia}</TableCell>
                    <TableCell align="left">{item.semestre}</TableCell>
                    <TableCell align="left">{item.curso}</TableCell>
                    <TableCell align="left">{item.practicaDetalle.anio}</TableCell>
                    
                    <TableCell align="left">{item.practicaDetalle.totalHoras}</TableCell>
                    <TableCell align="left">{item.practicaDetalle.convenioTutor.tutor.cedulaIdentidad}</TableCell>
                    <TableCell align="left">
                          {item.practicaDetalle.convenioTutor?.tutor?.nombres}&nbsp;{ item.practicaDetalle.convenioTutor?.tutor?.apellidos}
                          </TableCell>
                    <TableCell align="left">{item.practicaDetalle.establecimiento.nombreServicio.nombre}</TableCell>
                  </TableRow>
                ))
                :
                <TableRow>
                  <TableCell colSpan={12}>
                    <Typography align="center" color="primary" variant="body1">No hay datos para mostrar</Typography>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Grid>
      </Grid>

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
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="primary"
            disabled={!practicas.length > 0}
            onClick={handleConfirmar}
          >
            Confirmar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Form;
