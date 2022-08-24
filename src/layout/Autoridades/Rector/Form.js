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
import { Link, useParams } from "react-router-dom";
import UserContext from "../../../context/User/UserContext";
import AdjuntosDialog from "../../../dialogs/AdjuntosDialog";
import commonMethods from "../../../utils/commonMethods";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import Alert from "../../../components/Alert";
import { getSedeSeleccionada } from "services/UsuarioService";

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
  nombres: yup.string().required("El campo nombres es requerido"),
  apellidos: yup.string().required("El campo apellidos es requerido"),
  ci: yup.string().required("El campo cédula de identidad es requerido"),
  email: yup.string().email("Ingrese un email válido").required("El campo email es requerido"),
  genero: yup.string().required("El campo género es requerido"),
});

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
  const [nacionalidadOptions, setNacionalidadOptions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [tipoDoc, setTipoDoc] = useState();
  const [idFotocopiaCI, setIdFotocopiaCI] = useState("");
  const [idTituloGrado, setIdTituloGrado] = useState("");
  const [idTituloPosgrado, setIdTituloPosgrado] = useState("");
  const [idRector, setIdRector] = useState();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [fechaCreacion, setFechaCreacion] = useState(new Date());
  const [idUsuarioCreacion, setIdUsuarioCreacion] = useState();
  const { userData } = useContext(UserContext);
  const isAdmin = userData && userData.role.descripcion === "ROLE_ADMIN";
  const params = useParams();
  const methods = useForm({ resolver: yupResolver(validationSchema) });
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
      const responseRector = await DnerhsApi.get(
        `/convenios/${params.convenioId}/rector`
      );

      const responseGenero = await DnerhsApi.get("/generos", {
        params: { pageSize: 100 },
      });

      console.log("responseGenero", responseGenero);

      setGeneroOptions(
        responseGenero.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );

      const { data: responseNacionalidadData } = await DnerhsApi.get(`/nacionalidades`, {
        params: { pageSize: 100 },
      });

      loadNacionalidadOptions(responseNacionalidadData);

      console.log("responseRector", responseRector);
      if (responseRector.data) {
        const values = {
          direccionRectoria: responseRector.data.direccionRectoria,
          fotocopiaCedula: idFotocopiaCI,
          apellidos: responseRector.data.persona.apellido,
          ci: responseRector.data.persona.cedulaIdentidad,
          email: responseRector.data.persona.email,
          genero: responseRector.data.persona.genero.id,
          nacionalidad: responseRector.data.persona.nacionalidad.id,
          nombres: responseRector.data.persona.nombre,
          telefono: responseRector.data.persona.telefono,
          profesion: responseRector.data.profesion,
          titulosGrado: idTituloGrado,
          titulosPosgrado: idTituloPosgrado,
        };
        const fields = [
          "direccionRectoria",
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
        setIdRector(responseRector.data.id);
        setIdFotocopiaCI(responseRector.data.fotocopiaCedula);
        setIdTituloGrado(responseRector.data.titulosGrado);
        setIdTituloPosgrado(responseRector.data.titulosPosgrado);
        setFechaCreacion(responseRector.data.fechaCreacion);
        setIdUsuarioCreacion(responseRector.data.idUsuarioCreacion);
        setIsReadOnly(true);
      } else {
        const datosMaximaAutoridad = getSedeSeleccionada();
        console.log("datosMaximaAutoridad", datosMaximaAutoridad);
        const values = {
          apellidos: datosMaximaAutoridad.maximaAutoridad.apellidos,
          ci: datosMaximaAutoridad.maximaAutoridad.cedulaIdentidad,
          email: datosMaximaAutoridad.maximaAutoridad.email,
          nombres: datosMaximaAutoridad.maximaAutoridad.nombres,
          telefono: datosMaximaAutoridad.maximaAutoridad.telefono,
        };
        const fields = ["apellidos", "ci", "email", "nombres", "telefono"];
        fields.forEach((x) => setValue(x, values[x]));
      }
    } catch (error) {
      console.log("Error al cargar pagina", error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      convenio: {
        id: params.convenioId,
      },
      direccionRectoria: data.direccionRectoria,
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
    };

    try {
      if (!idRector) {
        let url = "/convenios/rector";
        const response = await DnerhsApi.post(url, {
          ...payload,
        });
          Alert.show({
            message:"Datos guardados exitosamente.",
            type : "success"
          })
          await getServerData();
     
    } else {
        let url = "/convenios/rector";
        const response = await DnerhsApi.put(url, {
          id: idRector,
          fechaCreacion: fechaCreacion,
          idUsuarioCreacion: idUsuarioCreacion,
          ...payload,
        });
          Alert.show({
            message:"Datos actualizados exitosamente.",
            type : "success"
          })
          await getServerData();
    }
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
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
  }

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
          Rector o Director General
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
                    disabled={isReadOnly}
                    errorobj={errors} required
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="nombres"
                    label="Nombres"
                    disabled={isReadOnly}
                    errorobj={errors} required
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="apellidos"
                    label="Apellidos"
                    disabled={isReadOnly}
                    errorobj={errors} required
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="genero"
                    label="Género"
                    options={generoOptions}
                    disabled={isReadOnly}
                    errorobj={errors} required
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                      name="nacionalidad"
                      label="Nacionalidad"
                      disabled={isReadOnly}
                      options={nacionalidadOptions}
                      errorobj={errors} required
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
                    errorobj={errors} required
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="direccionRectoria"
                    label="Dirección Rectoría"
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
      <Grid container direction="row" justifyContent="flex-end" alignItems="center">
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            component={Link}
            to={`/autoridades/${params.convenioId}`}
          >
            Atrás
          </Button>
        </Grid>
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
