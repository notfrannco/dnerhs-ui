import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Card,
  CardContent,
  IconButton
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PublishIcon from "@material-ui/icons/Publish";
import VisibilityIcon from "@material-ui/icons/Visibility";
import GetAppIcon from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../api/DnerhsApi";
import FormInput from "../../Controls/Input";
import FormSelect from "../../Controls/Select";
import Message from "../../Message/Message";
import { Link, useParams } from "react-router-dom";
import FormDialog from "./FormDialog/FormDialog";
import AdjuntosDialog from "../../dialogs/AdjuntosDialog";
import commonMethods from "../../utils/commonMethods";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import Alert from "../../components/Alert";
import { trackPromise } from 'react-promise-tracker';
import history from "../../utils/History";
import Header from "components/Header";

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: theme.spacing(16),
    paddingRight: theme.spacing(16),
  },
  appBarSpacer: theme.mixins.toolbar,
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  field: {
    margin: theme.spacing(),
  },
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  button: {
    margin: theme.spacing(2),
  },
  okButton: {
    color: "#fff",
    backgroundColor: "#01C12B",
    margin: theme.spacing(),
  },
  denyButton: {
    color: "#fff",
    backgroundColor: "#ff0000",
    margin: theme.spacing(),
  },
  title: {
    fontSize: 14,
  },
}));

const validationSchema = yup.object().shape({
  ciudad: yup.number().required("El campo ciudad es requerido"),
  departamento: yup.number().required("El campo departamento es requerido"),
  direccion: yup.string().required("El campo direccion es requerido"),
  iemail: yup.string().email("Ingrese un email válido").required("El campo email es requerido"),
  institucion: yup.string().required("El campo institución es requerido"),
  nroLeyCreacion: yup.string().required("El campo número de ley de creación es requerido"),
  sede: yup.string().required("El campo sede es requerido"),
  itelefono: yup.string().required("El campo teléfono es requerido"),
  apellidos: yup.string().required("El campo apellidos es requerido"),
  ci: yup.string().required("El campo cédula de identidad es requerido"),
  email: yup.string().email("Ingrese un email válido").required("El campo email es requerido"),
  nombres: yup.string().required("El campo nombre es requerido"),
  telefono: yup.string().required("El campo telefono es requerido"),
  aci: yup.string().required("El campo cédula de identidad es requerido"),
  anombre: yup.string().required("El campo nombres es requerido"),
  aapellido: yup.string().required("El campo apellidos es requerido"),
  cargo: yup.string().required("El campo cargo es requerido"),
  aemail: yup.string().email("Ingrese un email válido").required("El campo email es requerido"),
  atelefono: yup.string().required("El campo telefono es requerido"),
});


const Form = () => {
  const classes = useStyles();
  const [departamentosOptions, setdepartamentosOptions] = useState([]);
  const [ciudadOptions, setCiudadOptions] = useState([]);
  const [sent, setSent] = useState(false);
  const [procesado, setProcesado] = useState(false);
  const [open, setOpen] = useState(false);
  const [idDesignacion, setIdDesignacion] = useState();
  const [idResponsable, setIdResponsable] = useState();
  const [observacion, setObservacion] = useState("");
  const [usuarioRevisor, setUsuarioRevisor] = useState();
  const [fechaRevision, setFechaRevision] = useState();
  const [openRechazoDialog, setOpenRechazoDialog] = useState(false);
  const [rechazada, setRechazada] = useState(false);
  const params = useParams();
  const isAddMode = !params.id;
  const methods = useForm({ resolver: yupResolver(validationSchema) });
  const { handleSubmit, errors, setValue } = methods;


  useEffect(() => {
    const load = () => {
      try {
        getServerData();
        if (!isAddMode) {
          setValuesForEdit();
        }
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const setValuesForEdit = async () => {
    try {
      let url = `/instituciones/formadoras/responsables/${params.id}`;
      const response = await DnerhsApi(url);
      console.log("setValuesForEdit", response);
      const values = {
        ciudad: response.data.formadora.ciudad.id,
        departamento: response.data.formadora.departamento.id,
        direccion: response.data.formadora.direccion,
        iemail: response.data.formadora.email,
        institucion: response.data.formadora.institucion,
        nroLeyCreacion: response.data.formadora.ley,
        sede: response.data.formadora.sede,
        itelefono: response.data.formadora.telefono,
        apellidos: response.data.responsable.apellidos,
        ci: response.data.responsable.cedulaIdentidad,
        email: response.data.responsable.email,
        nombres: response.data.responsable.nombres,
        telefono: response.data.responsable.telefono,
        aci: response.data.maximaAutoridad.cedulaIdentidad,
        anombre: response.data.maximaAutoridad.nombres,
        aapellido: response.data.maximaAutoridad.apellidos,
        cargo: response.data.maximaAutoridad.cargo,
        aemail: response.data.maximaAutoridad.email,
        atelefono: response.data.maximaAutoridad.telefono,
      };
      const fields = [
        "ciudad",
        "departamento",
        "direccion",
        "iemail",
        "institucion",
        "nroLeyCreacion",
        "sede",
        "itelefono",
        "apellidos",
        "ci",
        "email",
        "nombres",
        "telefono",
        "aci",
        "anombre",
        "aapellido",
        "cargo",
        "aemail",
        "atelefono",
      ];

      fields.forEach((x) => setValue(x, values[x]));
      setIdResponsable(response.data.responsable.id);
      setIdDesignacion(response.data.designacionResponsable);
      setProcesado(
        response.data.estado !==
        "Solicitud pendiente de autorización por DNERHS"
      );
      setRechazada(response.data.estado === "Solicitud rechazada por DNERHS");
      setObservacion(response.data.observacion);
      setUsuarioRevisor(response.data.usuarioRevisor);
      setFechaRevision(response.data.fechaRevision);
    } catch (error) {
      console.log(error);
    }
  };

  const getServerData = async () => {
    try {
      const responseDepartamentos = await DnerhsApi.get("/departamentos", {
        params: { pageSize: 100 },
      });
      const responseCiudad = await DnerhsApi.get("/departamentos/1/ciudades", {
        params: { pageSize: 100 },
      });
      setdepartamentosOptions(
        responseDepartamentos.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );
      setCiudadOptions(
        responseCiudad.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      designacionResponsable: idDesignacion,
      formadora: {
        ciudad: { id: data.ciudad },
        departamento: {
          id: data.departamento,
        },
        direccion: data.direccion,
        email: data.iemail,
        institucion: data.institucion,
        ley: data.nroLeyCreacion,
        sede: data.sede,
        telefono: data.itelefono,
        asignadas:0,
        disponibles:0,
        ocupadas:0
      },
      maximaAutoridad: {
        apellidos: data.aapellido,
        cargo: data.cargo,
        cedulaIdentidad: data.aci,
        email: data.aemail,
        nombres: data.anombre,
        telefono: data.atelefono,
      },
      responsable: {
        apellidos: data.apellidos,
        cedulaIdentidad: data.ci,
        email: data.email,
        nombres: data.nombres,
        telefono: data.telefono,
      },
    };
    try {
      let url = "/instituciones/formadoras/responsables";
      await trackPromise(DnerhsApi.post(url, {
        ...payload,
      }));
      setSent(true)
    } catch (error) {

    }
  };

  const aprobarRechazar = async (accion, motivo) => {
    try {
      let url = `/responsables/${idResponsable}/aprobacion?estado=${accion}&id=${idResponsable}&observacion=${motivo}`;

      await trackPromise(DnerhsApi.post(url));

      Alert.show({
        message: `${accion}`,
        type: "success",
      });
      history.goBack();
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
    aprobarRechazar("Solicitud rechazada por DNERHS", value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setIdDesignacion(value);
  };

  const downloadFile = async (name) => {
    let doc = idDesignacion;
    commonMethods.downloadFile(`/file/${doc}`, `${name}_${new Date()}`, true);
  };

  const buildReportLink = (data) => {
    let queryParams = "";
    console.log("Cuerpo del reporte");
    console.log(data);
    for (let [key, val] of Object.entries(data)) {
      queryParams += "&" + key + "=" + val;
    }
    return queryParams;
  };
  const buildReportObject = (data) => {
    let reportObject = {};
    reportObject["nombres"] = data["nombres"];
    reportObject["apellidos"] = data["apellidos"];
    reportObject["cedula"] = data["ci"];
    reportObject["correo"] = data["email"];
    reportObject["telefono"] = data["telefono"];
    reportObject["autoridadNombres"] = data["anombre"];
    reportObject["autoridadApellidos"] = data["aapellido"];
    reportObject["autoridadCedula"] = data["aci"];
    reportObject["autoridadCorreo"] = data["aemail"];
    reportObject["autoridadCargo"] = data["cargo"];
    return reportObject;
  };
  const handleDownloadReport = async (data) => {
    //let enlace = "http://localhost:9080/reportes/?name=anexo-2";
    let enlace = `${process.env.REACT_APP_DNERHS_REPORTES_PROTOCOL}://${process.env.REACT_APP_DNERHS_REPORTES_HOST}/?name=anexo-2`;
    let reportObject = buildReportObject(data);
    enlace += buildReportLink(reportObject);
    commonMethods.downloadFile(enlace, "designación.pdf", true);
  };

  return !sent ? (
    <>
      {isAddMode && <Header />}
      <div className={classes.appBarSpacer}>
        <div className={classes.main}>
          <Grid item xs={12}>
            {isAddMode ? (
              <Typography
                align="center"
                variant="h5"
                color="primary"
                className={classes.form}
              >
                Registro de responsable de institución formadora
              </Typography>
            ) : (
              <Typography
                align="center"
                variant="h5"
                color="primary"
                className={classes.form}
              >
                Revisión solicitud nuevo usuario
              </Typography>
            )}
          </Grid>
          <div>
            <FormProvider {...methods}>
              <Paper>
                <form>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                  >
                    <Grid item xs={12} className={classes.field}>
                      <Typography align="center" variant="h6" color="primary">
                        Datos del Responsable
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={classes.form}>
                      <Grid item xs={12} className={classes.field}>
                        <FormInput
                          name="ci"
                          label="Cédula de Identidad"
                          errorobj={errors}
                          required
                          disabled={!isAddMode}
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.field}>
                        <FormInput
                          name="nombres"
                          label="Nombres"
                          errorobj={errors}
                          required
                          disabled={!isAddMode}
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.field}>
                        <FormInput
                          name="apellidos"
                          label="Apellidos"
                          errorobj={errors}
                          required
                          disabled={!isAddMode}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={6} className={classes.form}>
                      <Grid item xs={12} className={classes.field}>
                        <FormInput
                          name="telefono"
                          label="Teléfono"
                          errorobj={errors}
                          required
                          disabled={!isAddMode}
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.field}>
                        <FormInput
                          name="email"
                          label="E-mail"
                          errorobj={errors}
                          required
                          disabled={!isAddMode}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Grid item xs={12} className={classes.field}>
                        <Typography align="center" variant="h6" color="primary">
                          Datos de la Institución Formadora
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className={classes.form}>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="institucion"
                            label="Institución"
                            errorobj={errors}
                            required
                            //options={institucionOptions}
                            disabled={!isAddMode}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="sede"
                            label="Sede"
                            errorobj={errors}
                            required
                            disabled={!isAddMode}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="itelefono"
                            label="Teléfono"
                            errorobj={errors}
                            required
                            disabled={!isAddMode}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="iemail"
                            label="E-mail"
                            errorobj={errors}
                            required
                            disabled={!isAddMode}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6} className={classes.form}>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="direccion"
                            label="Dirección"
                            errorobj={errors}
                            required
                            disabled={!isAddMode}
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormSelect
                            name="departamento"
                            label="Departamento"
                            options={departamentosOptions}
                            disabled={!isAddMode}
                            onChange={(e) => console.log("change select", e)}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormSelect
                            name="ciudad"
                            label="Ciudad"
                            options={ciudadOptions}
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="nroLeyCreacion"
                            label="N° Ley de creación"
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Grid item xs={12} className={classes.field}>
                        <Typography align="center" variant="h6" color="primary">
                          Datos de la Máxima Autoridad de la Institución
                          Formadora
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className={classes.form}>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="aci"
                            label="Cedula de Identidad"
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="anombre"
                            label="Nombres"
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="aapellido"
                            label="Apellidos"
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6} className={classes.form}>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="cargo"
                            label="Cargo"
                            //options={cargoOptions}
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="aemail"
                            label="E-mail"
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} className={classes.field}>
                          <FormInput
                            name="atelefono"
                            label="Teléfono"
                            disabled={!isAddMode}
                            errorobj={errors}
                            required
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </FormProvider>
          </div>
          <Grid container className={classes.form}>
            <Grid item xs={12}>
              <Paper>
                <Box p={1}>
                  <Typography
                    variant="h5"
                    color="primary"
                    align="center"
                    className={classes.title}
                  >
                    Adjuntos
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Documento</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={"adjuntos"}>
                        <TableCell align="left">
                          Designación de Responsable de la Gestión (firmado
                          digitalmente)
                        </TableCell>
                        <TableCell align="center">
                          {isAddMode && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              className={classes.button}
                              startIcon={<GetAppIcon />}
                              onClick={handleSubmit(handleDownloadReport)}
                            >
                              Descargar documento para firma
                            </Button>
                          )}
                          {isAddMode && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              className={classes.button}
                              onClick={() => handleClickOpen()}
                              startIcon={<PublishIcon />}
                            >
                              Subir documento firmado
                            </Button>
                          )}
                          {!isAddMode && (
                            <Tooltip title="Ver" aria-label="ver">
                              <>
                                <IconButton
                                  size="small"
                                  aria-label="ver"
                                  color="secondary"
                                  disabled={!idDesignacion}
                                  onClick={() =>
                                    downloadFile(
                                      "Designación de Responsable de la Gestión"
                                    )
                                  }
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {rechazada && (
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="h5" color="primary">
                  Motivo del rechazo
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
          {isAddMode ? (
            <Grid
              item
              container
              justifyContent="flex-end"
              alignItems="center"
              className={classes.form}
            >
              <Grid item className={classes.field}>
                <Button
                  variant="contained"
                  color="default"
                  component={Link}
                  to={`/login`}
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
                  Registrarse
                </Button>
              </Grid>
            </Grid>
          ) : !procesado ? (
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className={classes.form}
            >
              <Grid item className={classes.field}>
                <Button
                  variant="contained"
                  color="default"
                  component={Link}
                  to={`/responsables`}
                >
                  Atrás
                </Button>
              </Grid>
              <Grid item className={classes.field}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => handleOpenRechazoDialog()}
                >
                  Rechazar
                </Button>
              </Grid>
              <Grid item className={classes.field}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() =>
                    aprobarRechazar("Solicitud aprobada por DNERHS")
                  }
                >
                  Aprobar
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid item container justifyContent="flex-end" alignItems="center">
              <Button
                variant="contained"
                color="default"
                component={Link}
                to={`/responsables`}
              >
                Atrás
              </Button>
            </Grid>
          )}
          <FormDialog
            open={openRechazoDialog}
            onClose={handleCloseRechazoDialog}
            onAccept={onAcceptRechazoDialog}
            aria-labelledby="form-dialog-title"
          />
          <AdjuntosDialog
            open={open}
            onClose={handleClose}
            tipoDoc="Designación responsable"
            aria-labelledby="form-dialog-title"
          />
        </div>
      </div>
    </>
  ) : (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid>
          <Grid item xs={12}>
            <Message
              title="Registro de nuevo usuario enviado a la DNERHS"
              message="Aguarde la aprobación de la DNERHS para acceder al sistema. 
        Será notificado por correo en caso de aprobarse o rechazarse la solicitud."
            />
          </Grid>
          <Grid item container justifyContent="center" xs={12}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              component={Link}
              to={`/login`}
            >
              Volver al login
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Form;
