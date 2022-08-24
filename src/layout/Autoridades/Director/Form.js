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
import { ToastContainer, toast } from "react-toastify";
import FormInput from "../../../Controls/Input";
import FormSelect from "../../../Controls/Select";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../../context/User/UserContext";
import AdjuntosDialog from "../../../dialogs/AdjuntosDialog";
import commonMethods from "../../../utils/commonMethods";

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
  const [generoOptions, setGeneroOptions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [tipoDoc, setTipoDoc] = useState();
  const [idFotocopiaCI, setIdFotocopiaCI] = useState("");
  const [idTituloGrado, setIdTituloGrado] = useState("");
  const [idTituloPosgrado, setIdTituloPosgrado] = useState("");
  const [idDirector, setIdDirector] = useState();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [fechaCreacion, setFechaCreacion] = useState(new Date());
  const [idUsuarioCreacion, setIdUsuarioCreacion] = useState();
  const { userData } = useContext(UserContext);
  const isAdmin = userData && userData.role.descripcion === "ROLE_ADMIN";
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, reset, setValue } = methods;

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
      const responseDirector = await DnerhsApi.get(
        `/convenios/${params.convenioId}/director`
      );

      const responseGenero = await DnerhsApi.get("/generos", {
        params: { pageSize: 100 },
      });

      console.log("responseDirector", responseDirector);

      setGeneroOptions(
        responseGenero.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );
      if (responseDirector.data) {
        const values = {
          carrera: responseDirector.data.carrera,
          apellidos: responseDirector.data.persona.apellido,
          ci: responseDirector.data.persona.cedulaIdentidad,
          email: responseDirector.data.persona.email,
          genero: responseDirector.data.persona.genero.id,
          nacionalidad: responseDirector.data.persona.nacionalidad,
          nombres: responseDirector.data.persona.nombre,
          telefono: responseDirector.data.persona.telefono,
          profesion: responseDirector.data.profesion,
        };
        const fields = [
          "carrera",
          "apellidos",
          "ci",
          "email",
          "genero",
          "nacionalidad",
          "nombres",
          "telefono",
          "profesion",
        ];
        fields.forEach((x) => setValue(x, values[x]));
        setIdDirector(responseDirector.data.id);
        setIdFotocopiaCI(responseDirector.data.fotocopiaCedula);
        setIdTituloGrado(responseDirector.data.titulosGrado);
        setIdTituloPosgrado(responseDirector.data.titulosPosgrado);
        setFechaCreacion(responseDirector.data.fechaCreacion);
        setIdUsuarioCreacion(responseDirector.data.idUsuarioCreacion);
        setIsReadOnly(true);
      }
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
    const payload = {
      carrera: data.carrera,
      convenio: {
        id: params.convenioId,
      },
      fotocopiaCedula: idFotocopiaCI,
      persona: {
        apellido: data.apellidos,
        cedulaIdentidad: data.ci,
        email: data.email,
        genero: {
          id: data.genero,
        },
        nacionalidad: data.nacionalidad,
        nombre: data.nombres,
        telefono: data.telefono,
      },
      profesion: data.profesion,
      titulosGrado: idTituloGrado,
      titulosPosgrado: idTituloPosgrado,
    };

    if (!idDirector) {
      try {
        let url = "/convenios/director";
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
          await getServerData();
        } else {
          alert("Error al conectarse");
          console.log("error al conectarse");
        }
      } catch (error) {
        console.log("error catch");
      }
    } else {
      console.log("entra en el else");
      try {
        let url = "/convenios/director";
        const response = await DnerhsApi.put(url, {
          id: idDirector,
          fechaCreacion: fechaCreacion,
          idUsuarioCreacion: idUsuarioCreacion,
          ...payload,
        });
        if (response.status === 200) {
          toast.success("Modificado Correctamente.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          await getServerData();
        } else {
          alert("Error al conectarse");
          console.log("error al conectarse");
        }
      } catch (error) {
        console.log("error catch");
      }
    }
  };

  const handleClickOpen = (documento) => {
    setOpen(true);
    setTipoDoc(documento);
  };

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
          Director
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
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="ci"
                    label="Cédula de Identidad"
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
                  <FormInput
                    name="nacionalidad"
                    label="Nacionalidad"
                    disabled={isReadOnly}
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
                    name="profesion"
                    label="Profesión"
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
                          <IconButton
                            size="small"
                            aria-label="subir"
                            color="primary"
                            disabled={isAdmin || isReadOnly}
                            onClick={() => handleClickOpen(row.descripcion)}
                          >
                            <CloudUploadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ver" aria-label="ver">
                          <IconButton
                            size="small"
                            aria-label="ver"
                            color="secondary"
                            onClick={() =>
                              downloadFile(row.id, row.descripcion)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
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
      <Grid container direction="row" justify="flex-end" alignItems="center">
        {!isAdmin &&
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
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/convenios/editar/${params.convenioId}`}
          >
            Volver al convenio
          </Button>
        </Grid>
      </Grid>
      <AdjuntosDialog
        open={open}
        onClose={handleClose}
        tipoDoc={tipoDoc}
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
