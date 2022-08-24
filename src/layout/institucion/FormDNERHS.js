import React, { useEffect, useState } from "react";
import {
  Avatar,
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
import DnerhsApi from "../../api/DnerhsApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormInput from "../../Controls/Input";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import logo from "../../images/par_ucnsa.jpg";
import FormSelect from "../../Controls/Select";
import AdjuntosDialog from "../../Dialogs/AdjuntosDialog";

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
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
}));

const Form = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [idLogo, setIdLogo] = useState("");
  const [tipoUniversidadOptions, setTipoUniversidadOptions] = useState([]);
  const methods = useForm({});
  const { handleSubmit, errors, reset } = methods;

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
      const responsetipoInstitucion = await DnerhsApi.get(
        "/instituciones/tipos",
        {
          params: { pageSize: 100 },
        }
      );

      console.log("responseGenero", responsetipoInstitucion);

      setTipoUniversidadOptions(
        responsetipoInstitucion.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );
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
    console.log("data", data);
    const payload = {
      nombre: data.nombre,
      acronimo: data.acronimo,
      tipoInstitucion: { id: data.tipoInstitucion },
      logoInstitucion: idLogo,
    };

    console.log("payload", payload);

    try {
      let url = "/instituciones";
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
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("error catch");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setIdLogo(value);
  };

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Institución Formadora
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
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <Avatar alt="Logo" src={""} className={classes.large} />
                  </Grid>
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="nombre" label="Institución" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="acronimo" label="Acrónimo" />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="tipoInstitucion"
                    label="Tipo Institución"
                    options={tipoUniversidadOptions}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </div>
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={6}>
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
                      Logo de la Institución (.jpeg)
                    </TableCell>
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
                        <IconButton
                          size="small"
                          aria-label="ver"
                          color="secondary"
                          //onClick={() => console.log("prueba eliminar")}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
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
            onClick={() => (window.location.href = "/instituciones")}
          >
            Volver al listado
          </Button>
        </Grid>
      </Grid>
      <AdjuntosDialog
        open={open}
        onClose={handleClose}
        tipoDoc="Logo de la Institución"
        aria-labelledby="form-dialog-title"
      />
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
