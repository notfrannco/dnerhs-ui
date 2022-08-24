import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../api/DnerhsApi";
import FormInput from "../../../Controls/Input";
import FormDatePicker from "../../../Controls/DatePicker";
import FormSelect from "../../../Controls/Select";
import Alert from "../../../components/Alert";
import history from "../../../utils/History";
import { useParams, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/Auth";
import Roles from "../../../constants/Roles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AdjuntosDialog from "../../../dialogs/AdjuntosDialog";
import commonMethods from "../../../utils/commonMethods";
import { findByNumeroCedula } from "services/DatosPersonalesService";
import { getCarrerasProgramas, getEstudiante } from "services/ConvenioService";
import { getAll as getAllNacionalidades } from "services/NacionalidadService";
import { getAll as getAllGeneros } from "services/GeneroService";
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

const Form = () => {
  const classes = useStyles();
  const [carreraOptions, setCarreraOptions] = useState([]);
  const [nacionalidadOptions, setNacionalidadOptions] = useState([]);
  const [generoOptions, setGeneroOptions] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [estudianteResponseData, setEstudianteResponseData] = useState({});
  const [documentsOptions, setDocumentsOptions] = useState({
    bioseguridad: {
      tittle: "Capacitación en Bioseguridad",
    },
    contrato: {
      tittle: "Contrato",
    },
  });
  const [open, setOpen] = useState(false);
  const [uploadDialogTittle, setUploadDialogTittle] = useState("");
  const [documentSelectedKey, setDocumentSelectedKey] = useState("");
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, setValue, reset } = methods;
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
      const [responseCarreraPrograma, responseNacionalidad, responseGenero] =
        await Promise.all([
          getCarrerasProgramas(convenioId),
          getAllNacionalidades(),
          getAllGeneros(),
        ]);

      loadCarreraOptions(responseCarreraPrograma?.data);
      loadNacionalidadOptions(responseNacionalidad.data);
      loadGeneroOptions(responseGenero.data);
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const handleClickOpen = (documentKey) => {
    setUploadDialogTittle(documentsOptions[documentKey].tittle);
    setDocumentSelectedKey(documentKey);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);

    let documentOptionsCopy = { ...documentsOptions };
    documentOptionsCopy[documentSelectedKey].id = value;

    setDocumentsOptions({ ...documentOptionsCopy });
    setDocumentSelectedKey("");
  };

  const downloadFile = async (documentKey) => {
    let document = { ...documentsOptions[documentKey] };
    commonMethods.downloadFile(
      `/file/${document.id}`,
      `${documentKey}_${new Date()}`,
      true
    );
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
  };

  const loadNacionalidadOptions = (nacionalidades) => {
    if (nacionalidades) {
      setNacionalidadOptions(
        nacionalidades.map((nacionalidad) => ({
          label: nacionalidad.nombre,
          id: nacionalidad.id,
        }))
      );
    }
  };

  const loadGeneroOptions = (generos) => {
    if (generos) {
      setGeneroOptions(
        generos.map((genero) => ({
          label: genero.descripcion,
          id: genero.id,
        }))
      );
    }
  };

  const setValuesForEdit = async () => {
    try {
      let { convenioEstudianteId } = params;

      const { data: estudianteResponseData } = await getEstudiante(convenioEstudianteId);
      setEstudianteResponseData(estudianteResponseData);

      await getServerData({ convenioId: estudianteResponseData.convenio.id });

      let { estudiante } = estudianteResponseData;
      const formValues = {
        cedulaIdentidad: estudiante.cedulaIdentidad,
        fechaNacimiento: estudiante.fechaNacimiento,
        nombre: estudiante.nombres,
        apellido: estudiante.apellidos,
        nacionalidad: estudiante.nacionalidad.id,
        sexo: estudiante.sexo.id,
        carrera: estudiante.carrera.id,
        curso: estudiante.curso,
        semestre: estudiante.semestre,
        materia: estudiante.materia,
        anio: estudiante.anio,
        bioseguridad: estudiante.bioseguridad,
        contrato: estudiante.contrato,
      };

      let documentsOptionsCopy = {
        ...documentsOptions,
      };

      Object.keys(formValues).forEach((field) => {
        let formValue = formValues[field];

        if (documentsOptionsCopy[field] && formValue != null) {
          documentsOptionsCopy[field].id = formValue;
        } else {
          setValue(field, formValues[field]);
        }
      });

      setDocumentsOptions(documentsOptionsCopy);
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const onSubmit = async (data) => {
    if (!validFormData(data)) {
      return;
    }

    let url = "/convenios/estudiantes";

    const estudianteDataForm = {
      cedulaIdentidad: data.cedulaIdentidad,
      fechaNacimiento: data.fechaNacimiento,
      nombres: data.nombre,
      apellidos: data.apellido,
      nacionalidad: { id: data.nacionalidad },
      sexo: { id: data.sexo },
      carrera: { id: data.carrera },
      curso: data.curso,
      semestre: data.semestre,
      materia: data.materia,
      anio: data.anio,
      bioseguridad: documentsOptions.bioseguridad.id,
      contrato: documentsOptions.contrato.id,
    };

    try {
      let message = "";

      if (isUpdate) {
        let payloadUpt = { ...estudianteResponseData };

        let estudianteMerge = {
          ...payloadUpt.estudiante,
          ...estudianteDataForm,
        };

        payloadUpt.estudiante = estudianteMerge;

        await DnerhsApi.put(url, {
          ...payloadUpt,
        });

        message = "Datos guardados exitosamente.";
      } else {
        let payloadNew = {
          convenio: {
            id: params.convenioId,
          },
          estudiante: estudianteDataForm,
        };

        await DnerhsApi.post(url, {
          ...payloadNew,
        });

        message = "Datos actualizados exitosamente.";
      }

      Alert.show({
        message,
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

  const validFormData = (data) => {
    if (data.carrera === "") {
      showMessageError("El campo carrera es dato requerido");
      return false;
    }

    if (!documentsOptions.bioseguridad.id) {
      showMessageError(
        "El documento de capacitación de bioseguridad es requerido"
      );
      return false;
    }

    if (!documentsOptions.contrato.id) {
      showMessageError("El contrato es un documento requerido");
      return false;
    }

    return true;
  };

  const showMessageError = (message) => {
    Alert.show({
      message,
      type: "error",
    });
  };

  const handleFindDatosPersonales = async (event) => {
    let { target } = event;

    const { data } = await trackPromise(findByNumeroCedula(target.value));
    if (data) {
      setValue("nombre", data.nombres);
      setValue("apellido", data.apellidos);
      setValue("sexo", data.genero?.id);
      setValue("fechaNacimiento", data.fechaNacimiento);
    }
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Estudiante
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
                    name="cedulaIdentidad"
                    label="Cédula de Identidad"
                    onBlur={handleFindDatosPersonales}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="nombre"
                    label="Nombres"
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
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="carrera"
                    label="Carrera"
                    disabled={isReadOnly}
                    options={carreraOptions}
                  />
                </Grid>
                <Grid item md={12} className={classes.field}>
                  <FormInput
                    name="semestre"
                    label="Semestre"
                    type="number"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item md={12} className={classes.field}>
                  <FormInput
                    name="anio"
                    label="Año Lectivo"
                    type="number"
                    disabled={isReadOnly}
                  />
                </Grid>
              </Grid>

              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormDatePicker
                    name="fechaNacimiento"
                    label="Fecha Nacimiento"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="apellido"
                    label="Apellidos"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="sexo"
                    label="Sexo"
                    disabled={isReadOnly}
                    options={generoOptions}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="curso"
                    label="Curso"
                    type="number"
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
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid container className={classes.form}>
        <Grid item xs={12}>
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
              {documentsOptions &&
                Object.keys(documentsOptions).map((key, index) => (
                  <TableRow key={key}>
                    <TableCell align="left">
                      {documentsOptions[key].tittle}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Subir" aria-label="subir">
                        <span>
                          <IconButton
                            size="small"
                            aria-label="subir"
                            color="primary"
                            disabled={isReadOnly}
                            onClick={() => handleClickOpen(key)}
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
                            disabled={!documentsOptions[key].id}
                            onClick={() => downloadFile(key)}
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
        {hasRole(Roles.ROLE_USER) && (
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
        tipoDoc={uploadDialogTittle}
        aria-labelledby="form-dialog-title"
      />
    </div>
  );
};

export default Form;
