import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Fab,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import { ToastContainer, toast } from "react-toastify";
import FormInput from "../../Controls/Input";
import FormSelect from "../../Controls/Select";
import FormDatePicker from "../../Controls/DatePicker";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import FormCheckBox from "../../Controls/Checkbox";
import { Link, useParams } from "react-router-dom";

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
  title: {
    margin: theme.spacing(3),
  },
}));

const diasPracticaOptions = [
  {
    id: "lunes",
    descripcion: "Lunes",
  },
  {
    id: "martes",
    descripcion: "Martes",
  },
  {
    id: "miercoles",
    descripcion: "Miércoles",
  },
  {
    id: "jueves",
    descripcion: "Jueves",
  },
  {
    id: "viernes",
    descripcion: "Viernes",
  },
  {
    id: "sabado",
    descripcion: "Sábado",
  },
  {
    id: "domingo",
    descripcion: "Domingo",
  },
];

const Form = () => {
  const classes = useStyles();
  const [establecimientoOptions, setEstablecimientoOptions] = useState([]);
  const [materiaOptions, setMateriaOptions] = useState([]);
  const [tutorOptions, setTutorOptions] = useState([]);
  const [turnoOptions, setTurnoOptions] = useState([]);
  const [estudiantesOptions, setEstudiantesOptions] = useState([]);
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, reset, setValue } = methods;

  useEffect(() => {
    const load = () => {
      try {
        getServerData();
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const getServerData = async () => {
    try {
      const responseMateria = await DnerhsApi.get(
        `/convenios/${params.convenioId}/materias`,
        {
          params: { pageSize: 100 },
        }
      );
      setMateriaOptions(
        responseMateria.data.map((x) => ({
          label: `${x.materia.descripcion} - ${x.convenioCarreraPrograma.carreraPrograma.descripcion}`,
          id: x.id,
        }))
      );

      const responseEstablecimiento = await DnerhsApi.get(
        "/instituciones/establecimientos",
        {
          params: { pageSize: 100 },
        }
      );

      const responseTutor = await DnerhsApi.get(
        `/convenios/${params.convenioId}/tutores`,
        {
          params: { pageSize: 100 },
        }
      );

      /* const responseTurno = await DnerhsApi.get("/turnos", {
        params: { pageSize: 100 },
      });

      const responseEstudiantes = await DnerhsApi.get("/estudiantes", {
        params: { pageSize: 100 },
      }); */

      setEstablecimientoOptions(
        responseEstablecimiento.data.map((x) => ({
          label: x.nombre,
          id: x.id,
        }))
      );
      setTutorOptions(
        responseTutor.data.map((x) => ({
          label: x.tutor.persona.nombre,
          id: x.id,
        }))
      );
      /* setTurnoOptions(
        responseTurno.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      ); */
    } catch (err) {
      toast.error(err, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Error al cargar pagina", err);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      convenio: {
        id: params.convenioId,
      },
      convenioEstudianteList: [
        {
          id: 4,
        },
        {
          id: 5,
        },
      ],
      convenioMateria: {
        id: data.materia,
      },
      convenioTutor: {
        id: data.tutor,
      },
      domingo: data.domingo,
      fechaDesde: data.fechaDesde,
      fechaHasta: data.fechaHasta,
      institucionEstablecimientoCampoPracticaTurno: {
        id: 1,
      },
      jueves: data.jueves,
      lunes: data.lunes,
      martes: data.martes,
      miercoles: data.miercoles,
      sabado: data.sabado,
      viernes: data.viernes,
    };

    try {
      let url = "/convenios/practicas";
      const response = await DnerhsApi.post(url, {
        ...payload,
      });
      if (response.status === 200) {
        toast.success("Guardado Correctamente.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        reset();
      } else {
        alert("Error al conectarse");
        console.log("error al conectarse");
      }
    } catch (error) {
      console.log("error catch");
    }
  };
  const handleChange = (event) => {
    console.log(event);
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Prácticas de Estudiantes
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
          <form>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start"
            >
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="carrera"
                    label="Carrera / Programa"
                    options={materiaOptions}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="materia"
                    label="Materia"
                    options={materiaOptions}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="tutor"
                    label="Tutor"
                    options={tutorOptions}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="establecimiento"
                    label="Establecimiento"
                    options={establecimientoOptions}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="turno"
                    label="Turno"
                    options={turnoOptions}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormDatePicker name="fechaDesde" label="Fecha desde" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormDatePicker name="fechaHasta" label="Fecha hasta" />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
            >
              {diasPracticaOptions.map((row) => (
                <Grid item>
                  <FormCheckBox name={row.id} label={row.descripcion} />
                </Grid>
              ))}
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid container className={classes.form}>
        <Grid item xs={12}>
          <Paper>
            <Box p={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">CI</TableCell>
                    <TableCell align="left">Nombres</TableCell>
                    <TableCell align="left">Apellidos</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estudiantesOptions.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{row.ci}</TableCell>
                      <TableCell align="left">{row.nombre}</TableCell>
                      <TableCell align="left">{row.apellido}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Eliminar" aria-label="eliminar">
                          <IconButton
                            size="small"
                            aria-label="eliminar"
                            color="primary"
                            onClick={() => console.log("prueba eliminar")}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
      >
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Grid>
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/practicasEstudiantes/${params.convenioId}`}
          >
            Volver al listado
          </Button>
        </Grid>
        <Grid item className={classes.field}>
          <TextField variant="outlined" label="CI" name="ci" />
        </Grid>
        <Grid item className={classes.field}>
          <Fab color="primary" aria-label="nuevo">
            <Tooltip title="Agregar" aria-label="nuevo">
              <AddIcon />
            </Tooltip>
          </Fab>
        </Grid>
      </Grid>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Form;
