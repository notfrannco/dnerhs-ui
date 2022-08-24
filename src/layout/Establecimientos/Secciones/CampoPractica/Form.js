import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../../api/DnerhsApi";
import FormInput from "../../../../Controls/Input";
import FormSelect from "../../../../Controls/Select";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useParams,useLocation } from "react-router-dom";
import AdjuntosDialog from "../../../../dialogs/AdjuntosDialog";
import commonMethods from "../../../../utils/commonMethods";
import Alert from "../../../../components/Alert";
import history from "../../../../utils/History";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";

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

const validationSchema = yup.object().shape({
  tipoHabilitacion: yup.string().required("El campo tipo habilitación es requerido"),
  tipoAcreditacion: yup.string().required("El campo datos del registro y categoria otorgada es requerido"),
  nivelServicio: yup.number().required("El campo nivel de servicio es requerido"),
  telefonoServicio: yup.string().required("El campo  teléfono es requerido"),
  regionSanitaria: yup.number().required("El campo regióń sanitaria desde es requerido"),
  emailServicio: yup.string().email("Ingrese un email válido").required("El campo correo electrónico del servicio es requerido"),
  direccionServicio: yup.string().required("El campo dirección de servicio es requerido")
});

const Form = () => {
  const classes = useStyles();
  const [regionSanitariaOptions, setRegionSanitariaOptions] = useState([]);
  const [nivelServicioOptions, setNivelServicioOptions] = useState([]);
  const [nombreServicioOptions, setNombreServicioOptions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = useState({
    habilitacion: null,
    acreditacion: null,
  });
  const [establecimientoDatoResponseData, setEstablecimientoDatoResponseData] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [whichFile, setWhichFile] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const params = useParams();
  const methods = useForm({
    resolver: yupResolver(validationSchema)
  });
  const { handleSubmit, errors, reset, setValue } = methods;
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
      const {data : responseDatoEstablecimiento} = await DnerhsApi.get(
        `instituciones/establecimientos/${params.establecimientoId}/datos`
      );

      const {data : responseEstablecimientoData} = await DnerhsApi.get(
        `instituciones/establecimientos/${params.establecimientoId}`
      );
   
      const responseRegionSanitariaOptions = await DnerhsApi.get(`/regiones`);
      setRegionSanitariaOptions(
        responseRegionSanitariaOptions.data.map((x) => ({
          label: x.region,
          id: x.id,
        }))
      );
      const responseNivelServicioOptions = await DnerhsApi.get(
        "/niveles-servicios"
      );
      setNivelServicioOptions(
        responseNivelServicioOptions.data.map((x) => ({
          label: x.nivel,
          id: x.id,
        }))
      );
      const responseNombreServicioOptions = await DnerhsApi.get("/servicios");
      setNombreServicioOptions(
        responseNombreServicioOptions.data.map((x) => ({
          label: x.nombre,
          id: x.id,
        }))
      );

      if (responseDatoEstablecimiento) {

        setEstablecimientoDatoResponseData(responseDatoEstablecimiento);

        const values = {
          regionSanitaria: responseDatoEstablecimiento.regionSanitaria.id,
          nombreServicio:
            responseDatoEstablecimiento.institucionEstablecimiento
              .nombreServicio.id,
          nivelServicio: responseDatoEstablecimiento.nivelServicio.id,
          tipoHabilitacion: responseDatoEstablecimiento.tipoHabilitacion,
          tipoAcreditacion: responseDatoEstablecimiento.tipoAcreditacion,
          direccionServicio: responseDatoEstablecimiento.direccion,
          emailServicio: responseDatoEstablecimiento.email,
          telefonoServicio: responseDatoEstablecimiento.telefono
        };
        const fields = [
          "tipoHabilitacion",
          "tipoAcreditacion",
          "nivelServicio",
          "nombreServicio",
          "telefonoServicio",
          "regionSanitaria",
          "emailServicio",
          "direccionServicio",
        ];
        fields.forEach((x) => setValue(x, values[x]));
        setFiles({
          acreditacion: responseDatoEstablecimiento.acreditacion,
          habilitacion: responseDatoEstablecimiento.habilitacion,
        });
        setIsUpdate(true);
      } else {
        setValue("nombreServicio", responseEstablecimientoData?.nombreServicio?.id);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const onSubmit = async (data) => {
   try {
    let message;

    let url = "/instituciones/establecimientos/datos";

    const payload = {
      regionSanitaria: {
        id: data.regionSanitaria,
      },
      nivelServicio: {
        id: data.nivelServicio,
      },
      tipoHabilitacion: data.tipoHabilitacion,
      habilitacion: files.habilitacion,
      tipoAcreditacion: data.tipoAcreditacion,
      acreditacion: files.acreditacion,
      direccion: data.direccionServicio,
      email: data.emailServicio,
      telefono: data.telefonoServicio,
      institucionEstablecimiento : {
        id: params.establecimientoId
    }
  }

    if (isUpdate) {
        const response = await DnerhsApi.put(url, {
          ...establecimientoDatoResponseData,...payload,
        });

        message = "Datos actualizados exitosamente.";
   
    } else {
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
      if (error.response) {
        Alert.showServerError(error);
      }
   }
  };

  const handleClickOpen = (file) => {
    setOpen(true);
    setWhichFile(file);
  };

  const handleClose = (value) => {
    setOpen(false);
    setFiles((prevState) => {
      return {
        ...prevState,
        [whichFile]: value,
      };
    });
  };

  const downloadFile = async (name, file) => {
    let doc = files[file];
    commonMethods.downloadFile(`/file/${doc}`, `${name}_${new Date()}`, true);
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Datos Generales del Campo de Práctica
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
          <form>
            <Grid container direction="row">
              <Grid item xs={6} className={classes.field}>
                <FormSelect
                  name="regionSanitaria"
                  label="Región Sanitaria"
                  options={regionSanitariaOptions}
                  disabled={isReadOnly}
                  required errorobj={errors}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormSelect
                  name="nombreServicio"
                  label="Establecimiento"
                  options={nombreServicioOptions}
                  disabled={true}
                  required errorobj={errors}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormSelect
                  name="nivelServicio"
                  label="Nivel del Servicio"
                  options={nivelServicioOptions}
                  disabled={isReadOnly}
                  required errorobj={errors}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="direccionServicio"
                  label="Dirección del Servicio"
                  disabled={isReadOnly}
                  required errorobj={errors}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="telefonoServicio"
                  label="Teléfono del Servicio"
                  disabled={isReadOnly}
                  required errorobj={errors}
                />
              </Grid>
              <Grid item xs={6} className={classes.field}>
                <FormInput
                  name="emailServicio"
                  label="Correo electrónico del Servicio"
                  disabled={isReadOnly}
                  required errorobj={errors}
                />
              </Grid>
              <Grid item xs={10} className={classes.field}>
                <FormInput
                  name="tipoHabilitacion"
                  label="Datos de la habilitación otorgada por la Dirección General de Establecimientos, Afines y Tecnología Sanitaria del MSPBS"
                  disabled={isReadOnly}
                  required errorobj={errors}
                />
              </Grid>
              <Grid
                item
                xs={2}
                className={classes.field}
                style={{ display: "flex" }}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  disabled={isReadOnly}
                  onClick={() => handleClickOpen("habilitacion")}
                >
                  Adjuntar
                </Button>
              </Grid>
              <Grid item xs={10} className={classes.field}>
                <FormInput
                  name="tipoAcreditacion"
                  label="Datos del registro y categoría otorgada por la Superintendencia de Salud"
                  disabled={isReadOnly}
                  required errorobj={errors}
                />
              </Grid>
              <Grid
                item
                xs={2}
                className={classes.field}
                style={{ display: "flex" }}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  size="large"
                  disabled={isReadOnly}
                  onClick={() => handleClickOpen("acreditacion")}
                >
                  Adjuntar
                </Button>
              </Grid>
            </Grid>
          </form>
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
                  <TableRow key={"adjuntos1"}>
                    <TableCell align="left">
                      Datos de la habilitación otorgada por la Dirección General de
                      Establecimiento, Afines y Tecnología Sanitaria del MSPBS
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver" aria-label="ver">
                        <>
                        <IconButton
                          size="small"
                          aria-label="ver"
                          color="secondary"
                          disabled={!files["habilitacion"]}
                          onClick={() =>
                            downloadFile(
                              "Datos de la Habilitación",
                              "habilitacion"
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        </>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  <TableRow key={"adjuntos2"}>
                    <TableCell align="left">
                      Datos del registro y categoría otorgada por la Superintendencia de Salud
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver" aria-label="ver">
                        <>
                        <IconButton
                          size="small"
                          aria-label="ver"
                          color="secondary"
                          disabled={!files["acreditacion"]}
                          onClick={() =>
                            downloadFile(
                              "Datos de la Acreditación",
                              "acreditacion"
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        </>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
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
        {!isReadOnly && (
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Guardar
              </Button>
            </Grid>
          )}
      </Grid>
      <AdjuntosDialog
        open={open}
        onClose={handleClose}
        tipoDoc="Subir Archivos"
        aria-labelledby="form-dialog-title"
      />
    </div>
  );
};

export default Form;
