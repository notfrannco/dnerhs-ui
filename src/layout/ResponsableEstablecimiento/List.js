import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Box,
  Grid,
  IconButton,
  makeStyles,
} from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import DnerhsApi, { CancelToken } from "../../api/DnerhsApi";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import useAuth from "../../hooks/Auth";
import Roles from "../../constants/Roles";
import DeleteDialog from "../../dialogs/DeleteDialog";
import Alert from "../../components/Alert";
import ResponseUtils from "../../utils/ResponseUtils";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(),
  },
  formControl: {
    margin: theme.spacing(2),
    //minWidth: 120,
  },
}));

const List = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(3);
  const { hasRole } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [toDelete, setToDelete] = useState();
  const [rows, setRows] = useState([]);

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
      let url = "/instituciones/establecimientos/responsables";
      const response = await DnerhsApi(url, {
        cancelToken: source.token,
      });
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
      let url = `/instituciones/establecimientos/responsables/${toDelete}`;
      await DnerhsApi.delete(url, {
        cancelToken: source.token,
      });

      Alert.show({ message: "Eliminado exitosamente.", type: "success" })

      await loadData({ page, rowsPerPage });

    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      }
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

  const showServerError = (error) => {
    let message = "Ocurrió un error inesperado, por favor vuelva a reintentar";
    if (error.response) {
      message = ResponseUtils.getMessageError(error.response);
    }

    Alert.show({
      message,
      type: "error"
    })
  }

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
              Solicitudes de Responsables de Instituciones Establecimientos
            </Typography>
            <Grid item xs={6}>
              
            </Grid>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">CI Responsable</TableCell>
                  <TableCell align="left">Nombre Responsable</TableCell>
                  <TableCell align="left">Apellido Responsable</TableCell>
                  <TableCell align="left">Establecimiento</TableCell>
                  <TableCell align="center">Accion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    
                    <TableCell align="left">
                      {row.cedulaIdentidad}
                    </TableCell>
                    <TableCell align="left">
                      {row.nombres}
                    </TableCell>
                    <TableCell align="left">
                      {row.apellidos}
                    </TableCell>
                    <TableCell align="left">
                      {row.institucionEstablecimiento.nombreServicio.nombre}
                    </TableCell>
                    <TableCell align="center">
                      {
                        (hasRole(Roles.ROLE_DNERHS)) &&
                        <>
                          <Link
                            to={{
                              pathname: `/establecimientos/responsables/editar/${row.id}`,
                              state: {
                                edit: true
                              }
                            }}>
                            <Tooltip title="Editar" aria-label="editar">
                              <IconButton
                                size="small"
                                aria-label="editar"
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </Link>
                      
                          <Tooltip title="Eliminar" aria-label="eliminar">
                            <IconButton
                              size="small"
                              aria-label="eliminar"
                              color="secondary"
                              onClick={() => handleOpenDialog(row.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    colSpan={8}
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
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
            {
              hasRole(Roles.ROLE_DNERHS) &&
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Grid item className={classes.button}>
                  <Link to="/establecimientos/responsables/crear">
                    <Fab color="primary" aria-label="nuevo">
                      <Tooltip title="Nuevo" aria-label="nuevo">
                        <AddIcon />
                      </Tooltip>
                    </Fab>
                  </Link>
                </Grid>
              </Grid>
            }
          </Box>
          <DeleteDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onAccept={deleteOne}
            aria-labelledby="form-dialog-title"
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
