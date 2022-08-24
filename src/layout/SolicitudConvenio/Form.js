import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import FormInput from "../../Controls/Input";
import FormSelect from "../../Controls/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import { Link as RouterLink, useParams } from "react-router-dom";
import SubmitConvenioDialog from "../../SubmitConvenioDialog/SubmitConvenioDialog";
import FormDialog from "./FormDialog/FormDialog";
import Alert from "../../components/Alert";
import AlertMUI from '@material-ui/lab/Alert';
import Roles from "../../constants/Roles";
import useAuth from "../../hooks/Auth";
import history from "../../utils/History";
import { getSedeSeleccionada } from "services/UsuarioService"
import { trackPromise } from 'react-promise-tracker';

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
  submit: {
    padding: theme.spacing(2),
  },
  alert: {
    color: "#ff0000",
  },
  cell : {
    fontSize: 18 
  }
}));

const categoriasOptions = [
  {
    id: "Grado",
    label: "Grado",
  },
  {
    id: "Postgrado",
    label: "Postgrado",
  },
  {
    id: "Pregrado",
    label: "Pregrado",
  },
];

const cargaDatosDocumentacion = [
  {
    id: 1,
    descripcion: "Datos de la institución formadora",
    estado: "Datos cargados",
    path: "/instituciones/crear",
  },
  {
    id: 2,
    descripcion: "Carreras o programas incluídos en el convenio",
    estado: "3 Carreras/Programas cargadas",
    path: "/convenios/carreras",
  },
  {
    id: 3,
    descripcion: "Datos de las autoridades de la institución formadora",
    estado: "Sin carga",
    path: "/autoridades",
  },
  {
    id: 4,
    descripcion: "Solicitud de suscripción de convenio",
    estado: "Sin carga",
    path: "/solicitudSuscripcion",
  },
  {
    id: 5,
    descripcion: "Documentos de respaldo académico",
    estado: "Datos cargados",
    path: "/docsRespaldo",
  }
];

const firmaConvenio = [
  {
    id: 1,
    descripcion:
      "Descarga del convenio para firma manuscrita de la máxima autoridad",
    estado: "",
    path: "/descargarConvenio",
    rolesRequired : [Roles.ROLE_DNERHS, Roles.ROLE_USER]
  },
  {
    id: 2,
    descripcion:
      "Registrar fecha de vigencia del convenio posterior a la firma",
    estado: "",
    path: "/registroVigencia",
    rolesRequired : [Roles.ROLE_DNERHS]
  },
];

const practicas = [
  /* {
    id: 1,
    descripcion: "Estudiantes",
    estado: "",
    path: "/alumnos",
  }, */
  {
    id : 2,
    descripcion : "Solicitudes y asignaciones de plazas",
    estado : "Sin carga",
    path : "/convenios/asignacionPlazas/solicitudes"
  },
  {
    id: 3,
    descripcion: "Datos de los tutores",
    estado: "Sin carga",
    path: "/convenios/tutores",
  },
  {
    id: 3,
    descripcion: "Datos de los estudiantes",
    estado: "Sin carga",
    path: "/convenios/estudiantes",
  },
  {
    id: 3,
    descripcion: "Datos estadisticos de estudiantes",
    estado: "Sin carga",
    path: "/convenios/profesionalesFormados",
  },
  {
    id: 4,
    descripcion: "Datos de los cronogramas de prácticas",
    estado: "Sin carga",
    path: "/convenios/cronogramasPracticas",
  },
  {
    id: 6,
    descripcion: "Datos de las asistencias de prácticas",
    estado: "Sin carga",
    path: "/convenios/confirmacionesPracticas",
  },
  /*{
    id: 3,
    descripcion: "Campos de Prácticas",
    estado: "",
    path: "/camposPractica",
  },
  {
    id: 4,
    descripcion: "Prácticas",
    estado: "",
    path: "/practicasEstudiantes",
  }, */
];

const Form = () => {
  const classes = useStyles();
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sent, setSent] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [institucionFormadoraId, setInstitucionFormadoraId] = useState();
  const [institucionFormadora, setInstitucionFormadora] = useState();
  const [institucionFormadoraResponseData, setInstitucionFormadoraResponseData] = useState({});
  const [observacion, setObservacion] = useState("");
  const [usuarioRevisor, setUsuarioRevisor] = useState();
  const [fechaRevision, setFechaRevision] = useState();
  const [sede, setSede] = useState();
  const [estadoConvenio, setEstadoConvenio] = useState("");
  const [procesado, setProcesado] = useState(false);
  const [openRechazoDialog, setOpenRechazoDialog] = useState(false);
  const params = useParams();
  const isAddMode = !params.id;
  const [openDialog, setOpenDialog] = useState(false);
  const { hasRole, hasAnyRole } = useAuth();
  const methods = useForm({});
  const { handleSubmit, errors, reset, setValue, getValues, formState } =
    methods;

  useEffect(() => {
    const load = () => {
      try {
        if (!isAddMode) {
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

  const setValuesForEdit = async () => {
    try {
      let url = `/convenios/${params.id}`;
      const {data : institucionFormadoraResponseData} = await DnerhsApi(url);

      console.log("setValues", institucionFormadoraResponseData);

      const values = {
        categoria: institucionFormadoraResponseData.categoria,
        estado: institucionFormadoraResponseData.estado
      };
      const fields = [
        "categoria",
        "estado",
        /* "fechaInicio",
        "fechaFin", */
        "sede",
        "institucion",
      ];

      fields.forEach((x) => setValue(x, values[x]));
      setInstitucionFormadoraResponseData(institucionFormadoraResponseData);
      setInstitucionFormadora(institucionFormadoraResponseData.institucionFormadora.institucion);
      setSede(institucionFormadoraResponseData.institucionFormadora.sede);
      setEstadoConvenio(institucionFormadoraResponseData.estado);
      setObservacion(institucionFormadoraResponseData.observacion);
      setUsuarioRevisor(institucionFormadoraResponseData.usuarioRevisor);
      setFechaRevision(institucionFormadoraResponseData.fechaRevision);
    } catch (error) {
      console.log(error);
    }
  };

  const getServerData = async () => {
    try {
      const datosInstitucion = getSedeSeleccionada();

      if (isAddMode) {
        const values = {
          institucion: datosInstitucion.formadora.institucion,
          sede: datosInstitucion.sede,
        };
        const fields = ["institucion", "sede"];
        fields.forEach((x) => setValue(x, values[x]));
        setInstitucionFormadoraId(datosInstitucion.formadora.id);
        setInstitucionFormadora(datosInstitucion.formadora.institucion);
        setSede(datosInstitucion.formadora.sede);
      }
    } catch (err) {
      console.log(err);
      Alert.show({
        message : "Error al obtener los datos",
        type : "error"
      })
    
    }
  };

  const onSubmit = async (data) => {
    let url = "/convenios";

    const payload = {
      categoria: data.categoria,
    };

    try {
      if (isAddMode) {
        payload.institucionFormadora = {
          id: institucionFormadoraId,
        };

        const response = await DnerhsApi.post(url, {
          ...payload,
        });
        Alert.show({
          message: "Datos Guardados exitosamente",
          type: "success",
        });
        //reset();
        setSaved(true);
        history.replace(`/convenios/editar/${response.data.id}`);
      } else {
        const response = await DnerhsApi.put(url, {
          ...institucionFormadoraResponseData,
          ...payload,
        });
        Alert.show({
          message: "Datos actualizados exitosamente",
          type: "success",
        });
        //reset();
        setSaved(true);
        //window.location.href = `/convenios/editar/${response.data.id}`;
      }
    } catch (error) {
      console.log(error);
      Alert.showServerError(error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    enviarSolicitud();
    setSent(true);
  };

  const enviarSolicitud = async () => {
    try {
      let url = `/convenios/${params.id}/revision`;
      const response = await DnerhsApi.post(url);
        Alert.show({
          message : "Solicitud de convenio enviado exitosamente.",
          type : "success"
        })
        window.location.href = `/convenios/editar/${params.id}`;
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const aprobarRechazar = async (estado, motivo) => {
    try {
      let url = `/convenios/${params.id}/aprobacion?estado=${estado}&id=${params.id}&observacion=${motivo}`;
      const response = await trackPromise(DnerhsApi.post(url));
      setSent(true);
        Alert.show({
          message : `${estado}`,
          type : "success"
        })
        setProcesado(true);
        window.location.href = `/convenios/editar/${params.id}`;
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const handleOpenRechazoDialog = () => {
    setOpenRechazoDialog(true);
  };

  const handleCloseRechazoDialog = (value) => {
    setOpenRechazoDialog(false);
  };

  const onAcceptRechazoDialog = (value) => {
    setOpenRechazoDialog(false);
    aprobarRechazar("Convenio con correcciones solicitadas por DNERHS", value);
  };

  return (
    <div>
      <div>
        <Paper>
          <Grid item xs={12}>
            <Grid item xs={12} className={classes.field}>
              <Typography
                color="primary"
                className={classes.title}
                variant="h4"
              >
                {institucionFormadora}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <Typography
                color="primary"
                className={classes.title}
                variant="h5"
              >
                Sede {sede}
              </Typography>
            </Grid>
          </Grid>
          <FormProvider {...methods}>
            <form>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={6} className={classes.form}>
                  <Hidden xlDown>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        name="institucion"
                        label="Institución"
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput name="sede" label="Sede" disabled={true} />
                    </Grid>
                  </Hidden>
                  <Grid item xs={12} className={classes.field}>
                    <FormSelect
                      name="categoria"
                      label="Categoría"
                      options={categoriasOptions}
                      disabled={!isAddMode && !isEditMode}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={6} className={classes.form}>
                  {!isAddMode && (
                    <Grid item xs={12} className={classes.field}>
                      <FormInput name="estado" label="Estado" disabled={true} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </form>
          </FormProvider>
          {!hasRole(Roles.ROLE_DNERHS) && (
            //<Hidden xlDown>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              {isAddMode || isEditMode ? (
                <Grid item className={classes.submit}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Guardar
                  </Button>
                </Grid>
              ) : (
                <Grid item className={classes.submit}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditMode(true)}
                  >
                    Editar
                  </Button>
                </Grid>
              )}
            </Grid>
            //</Hidden>
          )}
        </Paper>
      </div>

      <Box paddingTop={2} paddingBottom={2}>
        <AlertMUI severity="warning">             
          Todas las documentaciones y datos proveídos tienen carácter de
          Declaración Jurada
        </AlertMUI>
      </Box>

      {estadoConvenio ===
        "Convenio con correcciones solicitadas por DNERHS" && (
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <Typography variant="h5" color="secondary">
               Correcciones solicitadas
            </Typography>
            <Typography className={classes.pos} color="primary">
              {observacion}
            </Typography>
            <Typography variant="body2" component="p">
              Rechazado por: {usuarioRevisor}
            </Typography>
            <Typography variant="body2" component="p">
              Fecha: {fechaRevision}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper>
            <Box p={1}>
              <Typography
                variant="h5"
                color="primary"
                align="left"
                className={classes.title}
              >
                Creación de convenio
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Secciones</TableCell>
                    <TableCell align="right" />
                    {/* <TableCell align="left">Estado</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cargaDatosDocumentacion.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left" className={classes.cell}>
                        {row.descripcion}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          component={RouterLink}
                          to={`${row.path}/${params.id}`}
                          disabled={isAddMode}
                          startIcon={
                            isAddMode ? <VisibilityIcon /> : <EditIcon />
                          }
                        >
                          Editar
                        </Button>
                      </TableCell>
                      {/* <TableCell align="left">{row.estado}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!hasRole(Roles.ROLE_DNERHS) ? (
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item className={classes.submit}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDialog()}
                      disabled={
                        estadoConvenio !==
                          "Convenio en proceso de creación por el responsable" &&
                        estadoConvenio !==
                          "Convenio con correcciones solicitadas por DNERHS"
                      }
                    >
                      Solicitar revisión
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Grid item className={classes.field}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenRechazoDialog()}
                      disabled={
                        estadoConvenio !==
                        "Convenio pendiente de revisión por DNERHS"
                      }
                    >
                      Rechazar
                    </Button>
                  </Grid>
                  <Grid item className={classes.field}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        aprobarRechazar("Convenio pendiente de firma")
                      }
                      disabled={
                        estadoConvenio !==
                        "Convenio pendiente de revisión por DNERHS"
                      }
                    >
                      Aprobar
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper>
            <Box p={1}>
              <Typography
                variant="h5"
                color="primary"
                align="left"
                className={classes.title}
              >
                Firma manuscrita del convenio
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Secciones</TableCell>
                    <TableCell align="right" />
                    {/* <TableCell align="left">Estado</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {firmaConvenio.map((row, index) => (
                    hasAnyRole(row.rolesRequired) && 
                    <TableRow key={index}>
                      <TableCell align="left" className={classes.cell}>
                        {row.descripcion}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          component={RouterLink}
                          to={`${row.path}/${params.id}`}
                          disabled={
                            isAddMode ||
                           estadoConvenio !== "Convenio pendiente de firma"
                          }
                          startIcon={
                            isAddMode ? <VisibilityIcon /> : <EditIcon />
                          }
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper>
            <Box p={1}>
              <Typography
                variant="h5"
                color="primary"
                align="left"
                className={classes.title}
              >
                Carga de datos para certificados de práctica
              </Typography>
              <Table size="small" disabled>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Secciones</TableCell>
                    <TableCell align="right" />
                    {/* <TableCell align="left">Estado</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {practicas.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left" className={classes.cell}>
                        {row.descripcion}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          component={RouterLink}
                          to={`${row.path}/${params.id}`}
                          disabled={
                            isAddMode || estadoConvenio !== "Convenio firmado"
                          }
                          startIcon={
                            isAddMode ? <VisibilityIcon /> : <EditIcon />
                          }
                        >
                          Editar
                        </Button>
                      </TableCell>
                      {/* <TableCell align="left">{row.estado}</TableCell> */}
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
        justifyContent="flex-end"
        spacing={2}
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="default"
            onClick={() => history.goBack()}
          >
            Atrás
          </Button>
        </Grid>
      </Grid>
      <SubmitConvenioDialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      />
      <FormDialog
        open={openRechazoDialog}
        onClose={handleCloseRechazoDialog}
        onAccept={onAcceptRechazoDialog}
        aria-labelledby="form-dialog-title"
      />
    </div>
  );
};

export default Form;