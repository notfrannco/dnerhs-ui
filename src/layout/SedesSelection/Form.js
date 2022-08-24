import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import DnerhsApi from "../../api/DnerhsApi";
import { ToastContainer, toast } from "react-toastify";
import VisibilityIcon from "@material-ui/icons/Visibility";
import UserContext from "../../context/User/UserContext";
import history from "../../utils/History";
import { setSedeSeleccionada } from "services/UsuarioService"

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
  submit: {
    padding: theme.spacing(2),
  },
  alert: {
    color: "#ff0000",
  },
}));

const Form = () => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [institucionFormadora, setInstitucionFormadora] = useState();
  const [datosUser, setDatosUser] = useState();
  const { userData, refreshUserProfile } = useContext(UserContext);

  useEffect(() => {
    const load = () => {
      try {
        getServerData();
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, [userData]);

  const setInstitucion = async (institucionFormadora) => {
    setSedeSeleccionada(institucionFormadora)
    refreshUserProfile();
    history.push("/convenios");
  };

  const getServerData = async () => {
    try {
      const responseUser = await DnerhsApi.get(
        `/usuarios/${userData && userData.userId}`
      );

      console.log("responseUser", responseUser);

      setInstitucionFormadora(
        responseUser.data.institucionFormadoraResponsableMaximaAutoridadList[0]
          .formadora.institucion
      );
      setDatosUser(
        `${responseUser.data.institucionFormadoraResponsableMaximaAutoridadList[0].responsable.cedulaIdentidad} - ${responseUser.data.institucionFormadoraResponsableMaximaAutoridadList[0].responsable.nombres} ${responseUser.data.institucionFormadoraResponsableMaximaAutoridadList[0].responsable.apellidos}`
      );
      setRows(
        responseUser.data.institucionFormadoraResponsableMaximaAutoridadList
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

  return (
    <div>
      <Grid item xs={12}>
        <Grid item xs={12} className={classes.field}>
          <Typography variant="h4">{institucionFormadora}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.field}>
          <Typography variant="h5">{datosUser}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper>
            <Box p={1}>
              <Typography
                variant="h5"
                color="primary"
                align="left"
                className={classes.title}
              >
                Seleccione una sede
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Sedes</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left" style={{ fontSize: 22 }}>
                        {row.formadora.sede}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          onClick={() => setInstitucion(row)}
                          startIcon={<VisibilityIcon />}
                        >
                          VER
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
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
