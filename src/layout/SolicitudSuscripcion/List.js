import React, { useContext, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Box, Button, IconButton, Tooltip, Grid, makeStyles } from "@material-ui/core/";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DnerhsApi from "../../api/DnerhsApi";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/User/UserContext";
import AdjuntosDialog from "../../dialogs/AdjuntosDialog";
import commonMethods from "../../utils/commonMethods";
import Alert from "../../components/Alert";
import { trackPromise } from 'react-promise-tracker';

const REPORT_BASE_API_PATH = `${process.env.REACT_APP_DNERHS_REPORTES_PROTOCOL}://${process.env.REACT_APP_DNERHS_REPORTES_HOST}`;

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
  const [responseDataSolicitudes, setResponseDataSolicitudes] = useState();
  const [idSolicitudSuscripcion, setIdSolicitudSuscripcion] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const { userData } = useContext(UserContext);
  const isAdmin = userData && userData.role.descripcion === "ROLE_ADMIN";
  const params = useParams();

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
      const { data: responseDataSolicitudes } = await DnerhsApi.get(
        `/convenios/${params.convenioId}/Solicitudes`
      );

      if (responseDataSolicitudes) {
        setResponseDataSolicitudes(responseDataSolicitudes);
        setIdSolicitudSuscripcion(responseDataSolicitudes.solicitud);
        setIsUpdate(true);
      }

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const onSubmit = async (data) => {

    if (idSolicitudSuscripcion == "" || idSolicitudSuscripcion == null) {
      Alert.show({
        message: "Debe adjuntar la solicitud de suscripción",
        type: "error"
      });
      return;
    }

    const payload = {
      solicitud: idSolicitudSuscripcion
    };

    try {
      let message = "";

      let url = "/convenios/Solicitudes";

      if (!isUpdate) {

        payload.convenio = {
          id: params.convenioId,
        };

        await DnerhsApi.post(url, {
          ...payload,
        });

        message = "Datos guardados exitosamente.";
      } else {
        await DnerhsApi.post(url, {
          ...responseDataSolicitudes, ...payload,
        });

        message = "Datos actualizados exitosamente.";
      }

      Alert.show({
        message,
        type: "success"
      })
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setIdSolicitudSuscripcion(value);
  };

  const downloadFile = async (name) => {
    const doc = idSolicitudSuscripcion;

    await trackPromise(commonMethods.downloadFile(`/file/${doc}`, `${name}_${new Date()}`, true));
  };

  const handleDownloadReport = async () => {
    let serviceUrl = `${REPORT_BASE_API_PATH}/?name=anexo-1&convenioId=${params.convenioId}`;
    await trackPromise(commonMethods.downloadFile(serviceUrl, "solicitud.pdf", true));
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
              Solicitud de suscripción de convenio
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Documentos</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isAdmin && (
                  <TableRow key={1}>
                    <TableCell align="left">
                      Descargar la nota de suscripción de convenio con los datos
                      cargados para firmar digitalmente
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Descargar" aria-label="descargar">
                        <IconButton
                          size="small"
                          aria-label="subir"
                          color="primary"
                          onClick={() => handleDownloadReport()}
                        >
                          <CloudDownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow key={2}>
                  <TableCell align="left">
                    Subir solicitud firmada digitalmente
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Subir" aria-label="subir">
                      <span>
                        <IconButton
                          size="small"
                          aria-label="subir"
                          color="primary"
                          disabled={isAdmin}
                          onClick={() => handleClickOpen()}
                        >
                          <CloudUploadIcon />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Descargar" aria-label="descargar">
                      <span>
                        <IconButton
                          size="small"
                          aria-label="subir"
                          color="secondary"
                          disabled={!idSolicitudSuscripcion}
                          onClick={() => downloadFile("Solicitud suscripcion")}
                        >
                          <CloudDownloadIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
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
              tipoDoc="Solicitud Suscripcion"
              aria-labelledby="form-dialog-title"
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
