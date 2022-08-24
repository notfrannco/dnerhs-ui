import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi, { CancelToken } from "api/DnerhsApi";
import { Link } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import FormInput from "../../Controls/Input";
import GetAppIcon from "@material-ui/icons/GetApp";
import commonMethods from "../../utils/commonMethods";
import Header from "components/Header";
import AlertMUI from '@material-ui/lab/Alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Button
} from "@material-ui/core";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from '@material-ui/icons/Clear';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import { ReporteApi } from "config/ApiUrls";
import Alert from "components/Alert";

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(16),
    paddingRight: theme.spacing(16),
    paddingTop: theme.spacing(3),
  },
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  field: {
    margin: theme.spacing(),
  },
  button: {
    margin: theme.spacing(),
    paddingTop: theme.spacing(2),
  },
  alert: {
    color: "#ff0000",
  },
}));

const validationSchema = yup.object().shape({
  ci: yup.string().required("Es un campo requerido")
});

const Form = () => {
  const classes = useStyles();
  const methods = useForm({
    resolver: yupResolver(validationSchema)
  });
  const { handleSubmit, errors, formState, reset } = methods;
  const [constancias, setConstancias] = useState([]);
  const [warningMessage, setWarningMessage] = useState();

  const onSubmit = async (dataForm) => {
    setWarningMessage();

    let source = CancelToken.source();
    try {
      let url = `/constancias/estudiante?cedula=${dataForm.ci}`;
      const { data } = await DnerhsApi(url, {
        cancelToken: source.token,
      });

      if (data && data.length > 0) {
        setConstancias(data);

      } else {
        setConstancias([]);
        setWarningMessage("¡No se encontraron datos para la búsqueda!")
      }

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      } 
    }
  };

  const downloadFile = async (item) => {
    try {
      let name = "constancia"
      let url = `${ReporteApi.baseURL}?name=constancia&constanciaId=${item.id}`;
      trackPromise(commonMethods.downloadFile(url, `${name}_${new Date()}.pdf`, true));
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      } 
    }
  };

  const handleFormKeyPress = (event) => {
      if (event.key == "Enter") {
        event.preventDefault();
        handleSubmit(onSubmit)();
      }
  }

  const resetSearch = () => {
    reset();
    setConstancias([]);
  }

  return (
    <>
      <Header />
      <div className={classes.main}>
        <Grid item xs={12}>
          <Typography align="left" variant="h5" color="primary">
            Descargar Certificado de Práctica
          </Typography>
        </Grid>
        <div>
          <FormProvider {...methods}>
            <form
             onKeyPress={handleFormKeyPress}
            >
              <Grid
                container
                direction="row"
              >
                <Grid item xs={6} className={classes.form}>
                  <Grid item xs={12} className={classes.field}>
                    <FormInput 
                      name="ci" label="Ingrese el número de cédula"
                      errorobj={errors}
                      required
                      InputProps={{
                        endAdornment: (
                          <>
                            <InputAdornment position="end" onClick={resetSearch}>
                              <IconButton>
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                            <InputAdornment position="end" onClick={handleSubmit(onSubmit)}>
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </div>
        <Grid container className={classes.form}>
          {warningMessage &&
            <Grid item xs={12}>
              <AlertMUI severity="warning">No se encontraron datos para la búsqueda </AlertMUI>
            </Grid>
          }
          <Grid item xs={12}>
            <Typography align="center" variant="h6" color="primary">
              Certificados de prácticas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Estudiante</TableCell>
                  <TableCell align="left">Institucion</TableCell>
                  <TableCell align="left">Sede</TableCell>
                  <TableCell align="left">Carrera</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {constancias.length > 0 ?
                  constancias.map((item, key) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">{item.nombres + " " + item.apellidos}</TableCell>
                      <TableCell align="left">{item.institucionFormadora?.institucion}</TableCell>
                      <TableCell align="left">{item.institucionFormadora?.sede}</TableCell>
                      <TableCell align="left">{item.carrera.descripcion}</TableCell>
                      <TableCell align="center">
                      <Tooltip title="Ver" aria-label="ver">
                            <IconButton
                              size="small"
                              aria-label="ver"
                              color="primary"
                              onClick={() => downloadFile(item)}
                            >
                              <GetAppIcon />
                            </IconButton>
                        </Tooltip>

                      </TableCell>
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
                  to={`/login`}
                >
                  Atrás
                </Button>
              </Grid>
            </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Form;
