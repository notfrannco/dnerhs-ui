import React, { useState, useEffect } from "react";
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
import DnerhsApi from "api/DnerhsApi";
import "react-toastify/dist/ReactToastify.css";
import FormAutocomplete from "Controls/Autocomplete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Link, useParams } from "react-router-dom";
import AdjuntosDialog from "dialogs/AdjuntosDialog";
import commonMethods from "utils/commonMethods";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import Alert from "components/Alert";
import history from "utils/History";
import {
  getAll as getAllCarrerasProgramas
} from "services/CarreraProgramaService";

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

const validationSchema = yup.object().shape({
  carreraPrograma: yup.object().required("El campo carrera es requerido"),
});

const Form = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [idMallaCurricular, setIdMallaCurricular] = useState("");
  const [conveniioCarreraResponse, setConvenioCarreraResponse] = useState();
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const { convenioId, convenioCarreraId } = useParams();
  const methods = useForm({ resolver: yupResolver(validationSchema) });
  const { handleSubmit, errors, setValue } = methods;

  useEffect(() => {
    if (convenioCarreraId) {
      setIsUpdate(true);
      setValuesForEdit();
    } else {
      getServerData();
    }

  }, [])

  const getServerData = async () => {
    loadCarrerasOptions();
  }

  const loadCarrerasOptions = async () => {
    const { data: carrerasInsitucionResponseData } = await getAllCarrerasProgramas();

    setCarrerasOptions(carrerasInsitucionResponseData);
  }

  const setValuesForEdit = async () => {
    try {

      const { data: convenioCarreraResponseData } = await DnerhsApi.get(`/convenios/carreras-programas/${convenioCarreraId}`);

      setConvenioCarreraResponse(convenioCarreraResponseData);

      loadCarrerasOptions();

      let { carreraPrograma, mallaCurricular } = convenioCarreraResponseData;

      const formValues = {
        carreraPrograma,
      };

      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });

      if (mallaCurricular != null && mallaCurricular !== "") {
        setIdMallaCurricular(mallaCurricular)
      }

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  }

  const onSubmit = async (data) => {
    let url = "/convenios/carreras-programas";

    let message = "";

    let payload = {
      carreraPrograma: data.carreraPrograma,
      mallaCurricular: idMallaCurricular,
    };

    try {

      if (isUpdate) {
        payload = { ...conveniioCarreraResponse, ...payload };

        DnerhsApi.put(url, {
          ...payload,
        });

        message = "Datos actualizados exitosamente."

      } else {
        payload.convenio = {
          id: convenioId,
        };

        await DnerhsApi.post(url, {
          ...payload,
        });

        message = "Datos guardados exitosamente."
      }

      Alert.show({
        message,
        type: "success"
      })
      history.goBack();
    } catch (error) {
      console.log("error catch");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setIdMallaCurricular(value);
  };

  const downloadFile = async (name) => {
    const doc = idMallaCurricular;
    commonMethods.downloadFile(`/file/${doc}`, `${name}_${new Date()}`, true);
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Carreras / Programas
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
              {/* <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="codigo" label="Código" />
                </Grid>
              </Grid> */}
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormAutocomplete
                    options={carrerasOptions}
                    getOptionLabel={item => item.descripcion}
                    getOptionSelected={(option, value) => option.id === value.id}
                    name="carreraPrograma"
                    label="Seleccione una carrera"
                    //disabled={isReadOnly}
                    required
                    errorobj={errors} />
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
                  <TableRow>
                    <TableCell align="left">Malla curricular</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Subir" aria-label="subir">
                        <IconButton
                          size="small"
                          aria-label="subir"
                          color="primary"
                          onClick={() => handleClickOpen()}
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
                            disabled={!idMallaCurricular}
                            onClick={() => downloadFile("Malla curricular")}
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
      <Grid container direction="row" justify="flex-end" alignItems="center">
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
            onClick={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
      <AdjuntosDialog
        open={open}
        onClose={handleClose}
        tipoDoc="Malla curricular"
        aria-labelledby="form-dialog-title"
      />
    </div>
  );
};

export default Form;
