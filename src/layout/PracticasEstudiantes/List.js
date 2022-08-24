import React, { useContext, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, Button, Grid, makeStyles } from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DnerhsApi, { CancelToken } from "../../api/DnerhsApi";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteDialog from "../../dialogs/DeleteDialog";
import UserContext from "../../context/User/UserContext";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(),
  },
}));

const DatosFake = [
  {
    carrera: "Medicina",
    establecimiento: "Hospital Materno Infantil",
    materia: "Neonatología",
    tutor: "Lisa Martinez",
    turno: "Mañana",
  },
  {
    carrera: "Odontología",
    establecimiento: "Hospital Distrital de Paraguarí",
    materia: "Exodoncia",
    tutor: "Luis Casco",
    turno: "Tarde",
  },
  {
    carrera: "Enfermería",
    establecimiento: "Hospital Materno Infantil",
    materia: "Instrumentos",
    tutor: "Mario Gonzalez",
    turno: "Tarde",
  },
];

const List = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(3);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [toDelete, setToDelete] = useState();
  const params = useParams();
  const { userData } = useContext(UserContext);
  const isAdmin = userData && userData.role.descripcion === "ROLE_ADMIN";

  useEffect(() => {
    const load = () => {
      try {
        loadData({ page, rowsPerPage });
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const loadData = async ({ page = 0, rowsPerPage = 10 }) => {
    let source = CancelToken.source();
    try {
      let url = `/convenios/${params.convenioId}/practicas?page=${page}&pageSize=${rowsPerPage}`;
      const response = await DnerhsApi(url, {
        cancelToken: source.token,
      });
      console.log("response load data", response);
      const rows = response.data;
      setRows(rows);
      setTotalElements(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = async (event, newPage) => {
    setRows([]);
    try {
      setPage(newPage);
      await loadData({ page: newPage, rowsPerPage });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    let rowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowsPerPage);
    setRows([]);

    try {
      await loadData({ page, rowsPerPage });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOne = async () => {
    let source = CancelToken.source();
    try {
      let url = `/practicas/${toDelete}`;
      const response = await DnerhsApi.delete(url, {
        cancelToken: source.token,
      });
      console.log("response delete", response);
      if (response.status === 200) {
        toast.success(`Registro con id ${toDelete} eliminado correctamente`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        await loadData({ page, rowsPerPage });
      }
    } catch (error) {
      console.log(error);
    }
    setOpenDialog(false);
    setToDelete();
  };

  const handleOpenDialog = (id) => {
    setOpenDialog(true);
    setToDelete(id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
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
              Prácticas de Estudiantes
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Carrera / Programa</TableCell>
                  <TableCell align="left">Establecimiento</TableCell>
                  <TableCell align="left">Materia</TableCell>
                  <TableCell align="left">Tutor</TableCell>
                  <TableCell align="left">Turno</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DatosFake.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.carrera}</TableCell>
                    <TableCell align="left">{row.establecimiento}</TableCell>
                    <TableCell align="left">{row.materia}</TableCell>
                    <TableCell align="left">{row.tutor}</TableCell>
                    <TableCell align="left">{row.turno}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar" aria-label="editar">
                        <IconButton
                          size="small"
                          aria-label="editar"
                          color="primary"
                          disabled={isAdmin}
                          onClick={() => console.log("prueba editar")}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar" aria-label="eliminar">
                        <IconButton
                          size="small"
                          aria-label="eliminar"
                          color="secondary"
                          disabled={isAdmin}
                          onClick={() => handleOpenDialog(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    colSpan={6}
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "Registros por página" },
                      native: false,
                    }}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} de ${count}`
                    }
                    labelRowsPerPage="Registros por página"
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
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
                  color="primary"
                  //onClick={handleSubmit(onSubmit)}
                >
                  Descargar planilla de prácticas
                </Button>
              </Grid>
              <Grid item className={classes.button}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/convenios/editar/${params.convenioId}`}
                >
                  Volver al convenio
                </Button>
              </Grid>
              {!isAdmin && (
                <Grid item className={classes.button}>
                  <Link to={`/practicasEstudiantes/crear/${params.convenioId}`}>
                    <Fab color="primary" aria-label="nuevo">
                      <Tooltip title="Nueva práctica" aria-label="nuevo">
                        <AddIcon />
                      </Tooltip>
                    </Fab>
                  </Link>
                </Grid>
              )}
            </Grid>
          </Box>
          <DeleteDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onAccept={deleteOne}
            aria-labelledby="form-dialog-title"
          />
        </Paper>
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
    </Grid>

    /* <Grid container spacing={4}>
      <Grid item xs={12}>
        <Paper>
          <Box p={1}>
            <Typography
              variant="h5"
              color="primary"
              align="center"
              className={classes.title}
            >
              Prácticas de Estudiantes
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Carrera / Programa</TableCell>
                  <TableCell align="left">Establecimiento</TableCell>
                  <TableCell align="left">Materia</TableCell>
                  <TableCell align="left">Tutor</TableCell>
                  <TableCell align="left">Turno</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      {
                        row.convenioMateria.convenioCarreraPrograma
                          .carreraPrograma.descripcion
                      }
                    </TableCell>
                    <TableCell align="left">
                      {
                        row.institucionEstablecimientoCampoPracticaTurno
                          .institucionEstablecimientoCampoPractica
                          .institucionEstablecimiento.institucion.nombre
                      }
                    </TableCell>
                    <TableCell align="left">
                      {row.convenioMateria.materia.descripcion}
                    </TableCell>
                    <TableCell align="left">
                      {`${row.convenioTutor.tutor.persona.nombre} ${row.convenioTutor.tutor.persona.apellido}`}
                    </TableCell>
                    <TableCell align="left">
                      {row.institucionEstablecimientoCampoPracticaTurno.turno}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar" aria-label="editar">
                        <IconButton
                          size="small"
                          aria-label="editar"
                          color="primary"
                          disabled={isAdmin}
                          onClick={() => console.log("prueba editar")}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar" aria-label="eliminar">
                        <IconButton
                          size="small"
                          aria-label="eliminar"
                          color="secondary"
                          disabled={isAdmin}
                          onClick={() => handleOpenDialog(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    colSpan={6}
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "Registros por página" },
                      native: false,
                    }}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} de ${count}`
                    }
                    labelRowsPerPage="Registros por página"
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
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
                  color="primary"
                  //onClick={handleSubmit(onSubmit)}
                >
                  Descargar planilla de prácticas
                </Button>
              </Grid>
              <Grid item className={classes.button}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/convenios/editar/${params.convenioId}`}
                >
                  Volver al convenio
                </Button>
              </Grid>
              {!isAdmin && (
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
              Prácticas de Estudiantes
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Carrera / Programa</TableCell>
                  <TableCell align="left">Establecimiento</TableCell>
                  <TableCell align="left">Materia</TableCell>
                  <TableCell align="left">Tutor</TableCell>
                  <TableCell align="left">Turno</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      {
                        row.convenioMateria.convenioCarreraPrograma
                          .carreraPrograma.descripcion
                      }
                    </TableCell>
                    <TableCell align="left">
                      {
                        row.institucionEstablecimientoCampoPracticaTurno
                          .institucionEstablecimientoCampoPractica
                          .institucionEstablecimiento.institucion.nombre
                      }
                    </TableCell>
                    <TableCell align="left">
                      {row.convenioMateria.materia.descripcion}
                    </TableCell>
                    <TableCell align="left">
                      {`${row.convenioTutor.tutor.persona.nombre} ${row.convenioTutor.tutor.persona.apellido}`}
                    </TableCell>
                    <TableCell align="left">
                      {row.institucionEstablecimientoCampoPracticaTurno.turno}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar" aria-label="editar">
                        <IconButton
                          size="small"
                          aria-label="editar"
                          color="primary"
                          disabled={isAdmin}
                          onClick={() => console.log("prueba editar")}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar" aria-label="eliminar">
                        <IconButton
                          size="small"
                          aria-label="eliminar"
                          color="secondary"
                          disabled={isAdmin}
                          onClick={() => handleOpenDialog(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    colSpan={6}
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "Registros por página" },
                      native: false,
                    }}
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} de ${count}`
                    }
                    labelRowsPerPage="Registros por página"
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
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
                  color="primary"
                  //onClick={handleSubmit(onSubmit)}
                >
                  Descargar planilla de prácticas
                </Button>
              </Grid>
              <Grid item className={classes.button}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/convenios/editar/${params.convenioId}`}
                >
                  Volver al convenio
                </Button>
              </Grid>
              {!isAdmin && (
                <Grid item className={classes.button}>
                  <Link to={`/practicasEstudiantes/crear/${params.convenioId}`}>
                    <Fab color="primary" aria-label="nuevo">
                      <Tooltip title="Nueva práctica" aria-label="nuevo">
                        <AddIcon />
                      </Tooltip>
                    </Fab>
                  </Link>
                </Grid>
              )}
            </Grid>
          </Box>
          <DeleteDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onAccept={deleteOne}
            aria-labelledby="form-dialog-title"
          />
        </Paper>
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
    </Grid>
            <Grid item className={classes.button}>
                  <Link to={`/practicasEstudiantes/crear/${params.convenioId}`}>
                    <Fab color="primary" aria-label="nuevo">
                      <Tooltip title="Nueva práctica" aria-label="nuevo">
                        <AddIcon />
                      </Tooltip>
                    </Fab>
                  </Link>
                </Grid>
              )}
            </Grid>
          </Box>
          <DeleteDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onAccept={deleteOne}
            aria-labelledby="form-dialog-title"
          />
        </Paper>
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
    </Grid>
   */
  );
};

export default List;
