import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../api/DnerhsApi";
import FormInput from "../../../Controls/Input";
import FormSelect from "../../../Controls/Select";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useParams } from "react-router-dom";
import AdjuntosDialog from "../../../dialogs/AdjuntosDialog";
import commonMethods from "../../../utils/commonMethods";
import Alert from "../../../components/Alert";
import history from "../../../utils/History";
import useAuth from "../../../hooks/Auth";
import Roles from "../../../constants/Roles";
import { findByNumeroCedula } from "services/DatosPersonalesService";
import { getAll as getAllGeneros } from "services/GeneroService";
import { getAll as getAllNacionalidades } from "services/NacionalidadService";
import { trackPromise } from "react-promise-tracker";

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

const adjuntosOptions = [
  {
    id: 1,
    descripcion: "Fotocopia de CI",
  },
  {
    id: 2,
    descripcion: "Títulos de Grado",
  },
  {
    id: 3,
    descripcion: "Títulos de Postgrado",
  },
];

const Form = () => {
  const classes = useStyles();
  const [convenioDecanoResponseData, setConvenioDecanoResponseData] = useState({});
  const [generoOptions, setGeneroOptions] = useState([]);
  const [nacionalidadOptions, setNacionalidadOptions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [tipoDoc, setTipoDoc] = useState();
  const [idFotocopiaCI, setIdFotocopiaCI] = useState("");
  const [idTituloGrado, setIdTituloGrado] = useState("");
  const [idTituloPosgrado, setIdTituloPosgrado] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { hasRole } = useAuth();
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, reset, setValue } = methods;

  useEffect(() => {
    const load = () => {
      try {
        if (params.convenioDecanoId) {
          setIsReadOnly(true);
          setValuesForEdit();
        }
        getServerData();
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const setValuesForEdit = async () => {
    try {

      let { convenioDecanoId } = params;

      const { data: convenioDecanoResponseData } = await DnerhsApi.get(
        `/convenios/decanos/${convenioDecanoId}`
      );


      setConvenioDecanoResponseData(convenioDecanoResponseData);

      let { decano } = convenioDecanoResponseData;

      let { persona } = decano;

      const formValues = {
        nombres: persona.nombre,
        apellidos: persona.apellido,
        ci: persona.cedulaIdentidad,
        email: persona.email,
        nacionalidad: persona.nacionalidad?.id,
        genero: persona.genero?.id,
        telefono: persona.telefono,
        profesion: decano.profesion,
        carrera: decano.carrera
      };

      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });

      if (decano.fotocopiaCedula) {
        setIdFotocopiaCI(decano.fotocopiaCedula);
      }

      if (decano.titulosGrado) {
        setIdTituloGrado(decano.titulosGrado);
      }

      if (decano.titulosPosgrado) {
        setIdTituloPosgrado(decano.titulosPosgrado);
      }

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  }

  const getServerData = async () => {
    try {


      let [responseNacionalidad, responseGenero ] = await Promise.all([
        getAllNacionalidades(), getAllGeneros()
      ]);

     /* const responseGenero = await DnerhsApi.get("/generos", {
        params: { pageSize: 100 },
      });

      const { data: responseNacionalidadData } = await DnerhsApi.get(`/nacionalidades`, {
        params: { pageSize: 100 },
      });*/

      loadNacionalidadOptions(responseNacionalidad.data);

      loadGeneroOptions(responseGenero.data);

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const loadGeneroOptions = (generos) => {
    setGeneroOptions(
      generos.map((item) => ({
        label: item.descripcion,
        id: item.id,
      }))
    );
  }

  const loadNacionalidadOptions = (nacionalidades) => {
    if (nacionalidades) {
      setNacionalidadOptions(
        nacionalidades.map((nacionalidad) => ({
          label: nacionalidad.nombre,
          id: nacionalidad.id,
        }))
      );
    }
  }

  const onSubmit = async (data) => {
    const payload = {
      decano: {
        carrera: data.carrera,
        fotocopiaCedula: idFotocopiaCI,
        persona: {
          apellido: data.apellidos,
          cedulaIdentidad: data.ci,
          email: data.email,
          genero: {
            id: data.genero,
          },
          nacionalidad: { id: data.nacionalidad },
          nombre: data.nombres,
          telefono: data.telefono,
        },
        profesion: data.profesion,
        titulosGrado: idTituloGrado,
        titulosPosgrado: idTituloPosgrado,
      },
    };

    try {
      let message = "";

      if (!convenioDecanoResponseData.id) {
        let url = "/convenios/decanos";

        payload.convenio = {
          id: params.convenioId,
        };

        await DnerhsApi.post(url, {
          ...payload,
        });

        message = "Datos guardados exitosamente.";

        reset();

      } else {
        let url = "/convenios/decanos";
        await DnerhsApi.put(url, {
          ...convenioDecanoResponseData,
          ...payload,
        });
        message = "Datos modificados exitosamente.";
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

  const handleFindDatosPersonales = async (event) => {
    let {target} = event;
    
    const { data } = await trackPromise(findByNumeroCedula(target.value));
    if (data) {
      setValue("nombres", data.nombres);
      setValue("apellidos", data.apellidos);
      setValue("genero", data.genero?.id);
      setValue("fechaNacimiento", data.fechaNacimiento);
    }
  }

  const handleClickOpen = (documento) => {
    setOpen(true);
    setTipoDoc(documento);
  };

  const disabledDocumentView = (idDoc) => {
    if (idDoc === 1) {
      return idFotocopiaCI === "" || idFotocopiaCI == null;
    } else if (idDoc === 2) {
      return idTituloGrado === "" || idTituloGrado == null;
    } else if (idDoc === 3) {
      return idTituloPosgrado === "" || idTituloPosgrado == null;
    } else {
      return false;
    }
  }

  const handleClose = (value) => {
    setOpen(false);
    if (tipoDoc === "Fotocopia de CI") {
      setIdFotocopiaCI(value);
    } else if (tipoDoc === "Títulos de Grado") {
      setIdTituloGrado(value);
    } else if (tipoDoc === "Títulos de Postgrado") {
      setIdTituloPosgrado(value);
    }
  };

  const downloadFile = async (idDoc, name) => {
    let doc;
    if (idDoc === 1) {
      doc = idFotocopiaCI;
    } else if (idDoc === 2) {
      doc = idTituloGrado;
    } else if (idDoc === 3) {
      doc = idTituloPosgrado;
    }
    commonMethods.downloadFile(`/file/${doc}`, `${name}_${new Date()}`, true);
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Decano / Director Coordinador
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
          <form>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="ci"
                    label="Cédula de Identidad"
                    onBlur={handleFindDatosPersonales}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="nombres"
                    label="Nombres"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="apellidos"
                    label="Apellidos"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="genero"
                    label="Género"
                    options={generoOptions}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="nacionalidad"
                    label="Nacionalidad"
                    disabled={isReadOnly}
                    options={nacionalidadOptions}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="telefono"
                    label="Télefono"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="email"
                    label="E-mail"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="carrera"
                    label="Carrera"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="profesion"
                    label="Profesión"
                    disabled={isReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid container spacing={4}>
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
                  {adjuntosOptions.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{row.descripcion}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Subir" aria-label="subir">
                          <span>
                            <IconButton
                              size="small"
                              aria-label="subir"
                              color="primary"
                              disabled={isReadOnly}
                              onClick={() => handleClickOpen(row.descripcion)}
                            >
                              <CloudUploadIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Ver" aria-label="ver">
                          <span>
                            <IconButton
                              size="small"
                              aria-label="ver"
                              color="secondary"
                              disabled={disabledDocumentView(row.id)}
                              onClick={() =>
                                downloadFile(row.id, row.descripcion)
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </span>
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
          (!isReadOnly ? (
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Guardar
              </Button>
            </Grid>
          ) : (
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsReadOnly(false)}
              >
                Editar
              </Button>
            </Grid>
          ))}
      </Grid>
      <AdjuntosDialog
        open={open}
        onClose={handleClose}
        tipoDoc={tipoDoc}
        aria-labelledby="form-dialog-title"
      />
    </div>
  );
};

export default Form;
