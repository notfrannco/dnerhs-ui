import React, { useContext, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Box, Button, Grid, makeStyles } from "@material-ui/core/";
import { Link, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserContext from "../../../context/User/UserContext";
import commonMethods from "../../../utils/commonMethods";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(),
  },
}));

const List = () => {
  const classes = useStyles();
  const { userData } = useContext(UserContext);
  const isAdmin = userData && userData.role.descripcion === "ROLE_ADMIN";
  const params = useParams();

  const handleDownloadReport = async () => {
    let enlace = `${process.env.REACT_APP_DNERHS_REPORTES_PROTOCOL}://${process.env.REACT_APP_DNERHS_REPORTES_HOST}/?name=convenio&convenioId=${params.convenioId}`;
    //const enlace = `http://localhost:9080/reportes/?name=convenio&convenioId=${params.convenioId};`;
    commonMethods.downloadFile(enlace, "convenio.pdf", true);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          color="primary"
          align="center"
          className={classes.title}
        >
          Descargar convenio
        </Typography>
        <Paper>
          <Box p={1}>
            <Table size="small">
              <TableBody>
                <TableRow key={"docs"}>
                  <TableCell align="left">
                    Descarga del convenio para firma manuscrita de la máxima
                    autoridad
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.button}
                      onClick={() => handleDownloadReport()}
                    >
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <Grid item className={classes.button}>
                <Button
                  variant="contained"
                  color="default"
                  component={Link}
                  to={`/convenios/editar/${params.convenioId}`}
                >
                 Atrás
                </Button>
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
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
