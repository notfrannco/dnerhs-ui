import React, { useContext, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, Button, Grid, makeStyles } from "@material-ui/core/";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DnerhsApi from "../../api/DnerhsApi";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/User/UserContext";
import AdjuntosDialog from "../../dialogs/AdjuntosDialog";
import commonMethods from "../../utils/commonMethods";
import history from "../../utils/History";
import Alert from "../../components/Alert";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(),
  },
}));

const List = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [tipoDoc, setTipoDoc] = useState();
  const [
    idAneaesCertificadoInicioProceso,
    setIdAneaesCertificadoInicioProceso,
  ] = useState("");
  const [idAneaesPlanMejoras, setIdAneaesPlanMejoras] = useState("");
  const [
    idAneaesRespaldoProcesoEvaluacion,
    setIdAneaesRespaldoProcesoEvaluacion,
  ] = useState("");
  const [
    idConesResolucionRegistroOfertasAcademicas,
    setIdConesResolucionRegistroOfertasAcademicas,
  ] = useState("");
  const [idConstanciaGestionConvenio, setIdConstanciaGestionConvenio] =
    useState("");
  const [responseDocumentosData, setResponseDocumentosData] = useState({});
  const { userData } = useContext(UserContext);
  const [isUpdate, setIsUpdate] = useState(false);
  const isAdmin = userData && userData.role.descripcion === "ROLE_ADMIN";
  const params = useParams();

  const docsRespaldo = [
    {
      id: 1,
      descripcion:
        "ANEAES Certificado de inicio del proceso de Acreditación de la Entidad pertinente",
    },
    {
      id: 2,
      descripcion:
        "ANEAES Documento de respaldo del proceso de Evaluación Diagnóstica de la Entidad pertinente",
    },
    {
      id: 3,
      descripcion:
        "ANEAES Plan de implementación de las mejoras o modificaciones indicadas en la evaluación diagnóstica",
    },
    {
      id: 4,
      descripcion:
        "CONES Resolución de habilitación, actualización y/o inserción en el registro nacional de ofertas académicas",
    },
    {
      id: 5,
      descripcion:
        "Constancia provisoria para la gestión del Convenio con el MSPyBS, con el parecer favorable del CONES para Programas de Postgrado y sedes en proceso de habilitación",
    },
  ];

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
      const {data : responseDocumentosData} = await DnerhsApi.get(
        `/convenios/${params.convenioId}/documentos-respaldo`
      );

      if (responseDocumentosData) {
        setResponseDocumentosData(responseDocumentosData);

        setIdAneaesCertificadoInicioProceso(
          responseDocumentosData.aneaesCertificadoInicioProceso
        );
        setIdAneaesPlanMejoras(responseDocumentosData.aneaesPlanMejoras);
        setIdAneaesRespaldoProcesoEvaluacion(
          responseDocumentosData.aneaesRespaldoProcesoEvaluacion
        );
        setIdConesResolucionRegistroOfertasAcademicas(
          responseDocumentosData.conesResolucionRegistroOfertasAcademicas
        );
        setIdConstanciaGestionConvenio(
          responseDocumentosData.constanciaGestionConvenio
        );
        setIsUpdate(true);
      }

    } catch (error) {
      console.log("Error al cargar pagina", error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const onSubmit = async (data) => {

    if (
      (idAneaesCertificadoInicioProceso === "" ||
        idAneaesCertificadoInicioProceso == null) &&
      (idAneaesPlanMejoras === "" || idAneaesPlanMejoras == null) &&
      (idAneaesRespaldoProcesoEvaluacion === "" || idAneaesRespaldoProcesoEvaluacion == null)
    ) {
      Alert.show({
        message: "Es requerido por lo menos un documento de la ANEAES.",
        type: "error",
      });
      return;
    }

    if (
      (idConesResolucionRegistroOfertasAcademicas === "" ||
        idConesResolucionRegistroOfertasAcademicas == null) &&
      (idConstanciaGestionConvenio === "" ||
        idConstanciaGestionConvenio == null)
    ) {
      Alert.show({
        message: "Es requerido por lo menos un documento del CONES.",
        type: "error",
      });
      return;
    }

    const payload = {
      aneaesCertificadoInicioProceso: idAneaesCertificadoInicioProceso,
      aneaesPlanMejoras: idAneaesPlanMejoras,
      aneaesRespaldoProcesoEvaluacion: idAneaesRespaldoProcesoEvaluacion,
      conesResolucionRegistroOfertasAcademicas:
        idConesResolucionRegistroOfertasAcademicas,
      constanciaGestionConvenio: idConstanciaGestionConvenio,
      convenio: {
        id: params.convenioId,
      },
    };

    try {
      let url = "/convenios/documentos-respaldo";
      let message = "";
     
      if (isUpdate) {
       await DnerhsApi.put(url, {
          ...responseDocumentosData,...payload,
        });

        message = "Datos actualizados exitosamente.";
      }else {
       await DnerhsApi.post(url, {
          ...payload,
        });

        message = "Datos guardados exitosamente.";
      }
     
       Alert.show({
         message,
         type : "success"
       })

       history.goBack();

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const handleClickOpen = (documento) => {
    setOpen(true);
    setTipoDoc(documento);
  };

  const handleClose = (value) => {
    setOpen(false);
    if (tipoDoc === 1) {
      setIdAneaesCertificadoInicioProceso(value);
    } else if (tipoDoc === 2) {
      setIdAneaesRespaldoProcesoEvaluacion(value);
    } else if (tipoDoc === 3) {
      setIdAneaesPlanMejoras(value);
    } else if (tipoDoc === 4) {
      setIdConesResolucionRegistroOfertasAcademicas(value);
    } else if (tipoDoc === 5) {
      setIdConstanciaGestionConvenio(value);
    }
  };

  const disabledDocumentView = (documento) => {
    if (documento.id === 1) {
      return idAneaesCertificadoInicioProceso === "" || idAneaesCertificadoInicioProceso == null;
    } else if (documento.id === 2) {
      return idAneaesRespaldoProcesoEvaluacion === "" || idAneaesRespaldoProcesoEvaluacion == null;
    } else if (documento.id === 3) {
      return idAneaesPlanMejoras === "" || idAneaesPlanMejoras == null;
    } else if (documento.id === 4) {
      return idConesResolucionRegistroOfertasAcademicas === "" || idConesResolucionRegistroOfertasAcademicas == null;
    } else if (documento.id === 5) {
      return idConstanciaGestionConvenio === "" || idConstanciaGestionConvenio == null;
    } else {
      return true;
    }
  }

  const downloadFile = async (idDoc, name) => {
    let doc;
    if (idDoc === 1) {
      doc = idAneaesCertificadoInicioProceso;
    } else if (idDoc === 2) {
      doc = idAneaesRespaldoProcesoEvaluacion;
    } else if (idDoc === 3) {
      doc = idAneaesPlanMejoras;
    } else if (idDoc === 4) {
      doc = idConesResolucionRegistroOfertasAcademicas;
    } else if (idDoc === 5) {
      doc = idConstanciaGestionConvenio;
    }
    commonMethods.downloadFile(`/file/${doc}`, `${name}_${new Date()}`, true);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper>
          <Box p={1}>
            <Typography
            variant="h6"
            color="primary"
            align="center"
            className={classes.title}
          >
            Documentos de Respaldo
          </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Documento</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {docsRespaldo.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.descripcion}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Subir" aria-label="subir">
                        <IconButton
                          size="small"
                          aria-label="subir"
                          color="primary"
                          disabled={isAdmin}
                          onClick={() => handleClickOpen(row.id)}
                        >
                          <CloudUploadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver" aria-label="ver">
                        <>
                          <IconButton
                            size="small"
                            aria-label="ver"
                            color="secondary"
                            disabled={disabledDocumentView(row)}
                            onClick={() => downloadFile(row.id, row.descripcion)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item className={classes.button}>
                <Button
                  variant="contained"
                  color="default"
                  component={Link}
                  to={`/convenios/editar/${params.convenioId}`}
                >
                  Atrás
                </Button>
              </Grid>
              {!isAdmin && (
                <Grid item className={classes.button}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSubmit()}
                  >
                    Guardar
                  </Button>
                </Grid>
              )}
            </Grid>
            <AdjuntosDialog
              open={open}
              onClose={handleClose}
              tipoDoc={tipoDoc}
              aria-labelledby="form-dialog-title"
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
