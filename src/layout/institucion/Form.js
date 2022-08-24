import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
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
import DnerhsApi from "../../api/DnerhsApi";
import FormInput from "../../Controls/Input";
import FormSelect from "../../Controls/Select";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/User/UserContext";
import AdjuntosDialog from "../../dialogs/AdjuntosDialog";
import commonMethods from "../../utils/commonMethods";
import Alert from "../../components/Alert";
import Roles from "constants/Roles";

const adjuntosOptions = [
  {
    id: 1,
    descripcion: "Logotipo de la institución",
  },
  {
    id: 2,
    descripcion: "Copia autenticada de la Ley de creación de la Universidad",
  }
];

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
  const [ciudadOptions, setCiudadOptions] = useState([]);
  const [tipoDocSelected, setTipoDocSelected] = useState("");
  const [departamentosOptions, setdepartamentosOptions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [idCopiaLey, setIdCopiaLey] = useState("");
  const [idLogotipo, setIdLogotipo] = useState("");
  const [idSede, setIdSede] = useState();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [fechaCreacion, setFechaCreacion] = useState(new Date());
  const [idUsuarioCreacion, setIdUsuarioCreacion] = useState();
  const { userData } = useContext(UserContext);
  const isAdmin = userData && userData.roleName === Roles.ROLE_DNERHS;
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
      const responseSede = await DnerhsApi.get(
        `/convenios/${params.convenioId}`
      );

      const responseDepartamentos = await DnerhsApi.get("/departamentos", {
        params: { pageSize: 100 },
      });

      const responseCiudad = await DnerhsApi.get("/departamentos/1/ciudades", {
        params: { pageSize: 100 },
      });
  
      setCiudadOptions(
        responseCiudad.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );
      setdepartamentosOptions(
        responseDepartamentos.data.map((x) => ({
          label: x.descripcion,
          id: x.id,
        }))
      );
      if (responseSede.data) {
        const values = {
          ciudad: responseSede.data.institucionFormadora.ciudad.id,
          departamento: responseSede.data.institucionFormadora.departamento.id,
          direccion: responseSede.data.institucionFormadora.direccion,
          email: responseSede.data.institucionFormadora.email,
          institucion: responseSede.data.institucionFormadora.institucion,
          nroLeyCreacion: responseSede.data.institucionFormadora.ley,
          sede: responseSede.data.institucionFormadora.sede,
          telefono: responseSede.data.institucionFormadora.telefono,
        };
        const fields = [
          "ciudad",
          "departamento",
          "direccion",
          "email",
          "institucion",
          "nroLeyCreacion",
          "sede",
          "telefono",
        ];
        fields.forEach((x) => setValue(x, values[x]));
        setIdSede(responseSede.data.institucionFormadora.id);
        setIdCopiaLey(responseSede.data.institucionFormadora.copiaLey);
        setIdLogotipo(responseSede.data.institucionFormadora.logotipo);
        setFechaCreacion(responseSede.data.institucionFormadora.fechaCreacion);
        setIdUsuarioCreacion(
          responseSede.data.institucionFormadora.idUsuarioCreacion
        );
        setIsReadOnly(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      id: idSede,
      idUsuarioCreacion: idUsuarioCreacion,
      fechaCreacion: fechaCreacion,
      ciudad: { id: data.ciudad },
      copiaLey: idCopiaLey,
      logotipo:idLogotipo,
      departamento: {
        id: data.departamento,
      },
      direccion: data.direccion,
      email: data.email,
      institucion: data.institucion,
      ley: data.nroLeyCreacion,
      sede: data.sede,
      telefono: data.telefono,
    };
    try {
      let url = "/instituciones/formadoras";
      const response = await DnerhsApi.put(url, {
        ...payload,
      });
      Alert.show({
        message : "Datos actualizados exitosamente",
        type :"success"
      })
      await getServerData();
   
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const handleClickOpen = (tipoDoc) => {
    setTipoDocSelected(tipoDoc)
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    if (tipoDocSelected === "Logotipo de la institución") {
      setIdLogotipo(value);
    }else {
      setIdCopiaLey(value);
    }
    setTipoDocSelected("");
  };

  const downloadFile = async (document) => {

    let doc;

    if (document.id === 1) {
      doc = idLogotipo;
    } else {
      doc = idCopiaLey;
    }

    commonMethods.downloadFile(`/file/${doc}`, `${document.descripcion}_${new Date()}`, true);
  };

  const disabledDocumentView = (docId) => {
    if (docId === 1) {
      return idLogotipo === "" || idLogotipo == null;
    } else if (docId === 2) {
      return idCopiaLey === "" || idCopiaLey == null;
    } else {
      return false;
    }
  }

  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Datos de la Institución Formadora
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
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <Avatar alt="Logo" src={""} className={classes.large} />
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="institucion"
                    label="Institución"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput name="sede" label="Sede" disabled={isReadOnly} />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="departamento"
                    label="Departamento"
                    options={departamentosOptions}
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormSelect
                    name="ciudad"
                    label="Ciudad"
                    options={ciudadOptions}
                    disabled={isReadOnly}
                  />
                </Grid>
                {/* <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="instRectora"
                    label="Institución Rectora"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="emailInstRectora"
                    label="E-mail de la Institución Rectora"
                    disabled={isReadOnly}
                  />
                </Grid> */}
              </Grid>
              <Grid item xs={6} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="direccion"
                    label="Dirección"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="telefono"
                    label="Teléfono"
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
                    name="nroLeyCreacion"
                    label="N° Ley de creación"
                    disabled={isReadOnly}
                  />
                </Grid>
                {/* <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="dirInstRectora"
                    label="Dirección de la Institución Rectora"
                    disabled={isReadOnly}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    name="telInstRectora"
                    label="Teléfono de la Institución Rectora"
                    disabled={isReadOnly}
                  />
                </Grid> */}
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
                  {adjuntosOptions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="left">
                        {row.descripcion}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Subir" aria-label="subir">
                          <span>
                            <IconButton
                              size="small"
                              aria-label="subir"
                              color="primary"
                              disabled={isAdmin || isReadOnly}
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
                                downloadFile(row)
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
            component={Link}
            to={`/convenios/editar/${params.convenioId}`}
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
        tipoDoc={tipoDocSelected}
        aria-labelledby="form-dialog-title"
      />
    </div>
  );
};

export default Form;
