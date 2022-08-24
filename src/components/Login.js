import React, { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../images/dnerhs.jpg";
import { Link as RouterLink } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import FormInput from "Controls/Input";
import { login } from "services/AuthService";
import UserContext from "context/User/UserContext";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import classNames from "classnames";
import Footer from "components/Footer";
import { yupResolver } from "@hookform/resolvers";
import { getMainRouteForRole } from "config/Routes"

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  message: {
    height: "100px",
    width : "400px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "6%",
    borderRadius: "5px",
    background: theme.palette.primary.main
  },
  bannerCert: {
    marginTop: theme.spacing(2),
    width: "100%",
    height: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "6%",
    borderRadius: "5px",
    background: "yellow",
    maxHeight: "70px",
  },
  bannerList: {
    marginTop: theme.spacing(2),
    width: "100%",
    height: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "6%",
    borderRadius: "5px",
    background: "orange",
    maxHeight: "70px",
  },
  errorMessage: {
    background: "linear-gradient(270deg, #FF9212 5.35%, #FF1212 96.24%)",
  },
  messageIcon: { color: "white", marginRight: theme.spacing(3) },
  messageText: {
    color: "white",
  },
}));

const LoginSchema = yup.object().shape({
  username: yup.string().required("El usuario es un campo requerido"),
  password: yup
    .string()
    .required("La contraseña es un campo requerido")
});

export default function Login(props) {
  const classes = useStyles();
  const { refreshUserProfile } = useContext(UserContext);
  const [redirect, setRedirect] = useState();
  const [error, setError] = useState("");
  const methods = useForm({
    resolver: yupResolver(LoginSchema)
  });
  const { handleSubmit, errors, reset, register } = methods;
 
  const onSubmit = async (data) => {
    const { history } = props;
      const response = await login(data.username, data.password);
      if (response.status === "OK") {
        await refreshUserProfile();
        history.replace(getMainRouteForRole(response.role.descripcion))
      } else {
        setError(response.message);
        console.log("error al conectarse");
      }
      setRedirect(true);
  };

  useEffect(() => {
    setRedirect(true);
  }, [redirect]);

  return (
    <Container component="main">
      <Grid container direction="row" justifyContent="flex-end" alignItems="center">
        <Grid item xs={6}>
          <div className={classes.bannerCert}>
            <Button
              variant="text"
              size="large"
              component={RouterLink}
              to={`/descargarCertificado`}
            >
              Descargar Certificado de Práctica
            </Button>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.bannerList}>
            <Button
              variant="text"
              size="large"
              component={RouterLink}
              to={`/listadoConveniosVigentes`}
            >
              Listado de convenios firmados
            </Button>
          </div>
        </Grid>
      </Grid>
      <CssBaseline />
      <div
        className={classes.paper}
        style={{ maxWidth: "400px", marginLeft: "400px" }}
      >
        <img width="200px" alt="Logo" src={logo} />
        {error === "" ? (
          <div className={classes.message}>
            <InfoIcon fontSize="large" className={classes.messageIcon} />
            <Typography variant="caption" className={classes.messageText}>
              Ingrese su usuario y contraseña, en caso de no poseer dichas
              credenciales favor registrarse en el link proporcionado más abajo.
            </Typography>
          </div>
        ) : (
          <div className={classNames(classes.message, classes.errorMessage)}>
            <WarningIcon fontSize="large" className={classes.messageIcon} />
            <Typography variant="caption" className={classes.messageText}>
              {error}
            </Typography>
          </div>
        )}
        <FormProvider {...methods}>
          <form >
            <FormInput
              className={classes.form}
              name="username"
              label="Usuario"
              required
              errorobj={errors}
            />
            <FormInput
              className={classes.form}
              name="password"
              label="Contraseña"
              type="password"
              required
              errorobj={errors}
            />
          </form>
        </FormProvider>
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          alignItems="center"
          className={classes.submit}
        >
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleSubmit(onSubmit)}
             
            >
              Ingresar
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Typography>¿No cuenta con usuario?</Typography>
          </Grid>
          <Grid item xs>
            <RouterLink to="/responsable/crear" variant="body2">
              Registro de responsables
            </RouterLink>
          </Grid>
        </Grid>
      </div>

      <Box mt={8}>
        <Footer />
      </Box>
    </Container>
  );
}
