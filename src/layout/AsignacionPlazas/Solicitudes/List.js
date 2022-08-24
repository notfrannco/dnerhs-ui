import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, Grid, makeStyles, Button } from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DnerhsApi, { CancelToken } from "api/DnerhsApi";
import { Link, useParams } from "react-router-dom";
import DeleteDialog from "dialogs/DeleteDialog";
import Alert from "components/Alert";
import history from "utils/History";
import useAuth from "hooks/Auth";
import Roles from "constants/Roles";
import VisibilityIcon from '@material-ui/icons/Visibility';

const solicitudes = [
  {
    id: 1,
    carrera: "Carrera 1",
    anhio: 2020,
    plazasSolicitadas: 20,
  },
  {
    id: 2,
    carrera: "Carrera 2",
    anhio: 2020,
    plazasSolicitadas: 30,
  },
  {
    id: 3,
    carrera: "Carrera 3",
    anhio: 2020,
    plazasSolicitadas: 40,
  },
  {
    id: 4,
    carrera: "Carrera 4",
    anhio: 2020,
    plazasSolicitadas: 50,
  },
  {
    id: 5,
    carrera: "Carrera 5",
    anhio: 2020,
    plazasSolicitadas: 60,
  },
  {
    id: 6,
    carrera: "Carrera 6",
    anhio: 2020,
    plazasSolicitadas: 70,
  },
  {
    id: 7,
    carrera: "Carrera 7",
    anhio: 2020,
    plazasSolicitadas: 80,
  },
  {
    id: 8,
    carrera: "Carrera 8",
    anhio: 2020,
    plazasSolicitadas: 90,
  },
  {
    id: 9,
    carrera: "Carrera 9",
    anhio: 2020,
    plazasSolicitadas: 100,
  },
  {
    id: 10,
    carrera: "Carrera 10",
    anhio: 2020,
    plazasSolicitadas: 25,
  },
];

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(3);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [toDelete, setToDelete] = useState();
  const { userData } = useAuth();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const isAdmin = userData && userData.role.descripcion === Roles.ROLE_DNERHS;

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
        let url = `/solicitudes-plazas/page?page=${page}&pageSize=${rowsPerPage}&convenioId=${params.convenioId}`;
        const response = await DnerhsApi(url, {
        cancelToken: source.token,
      });
      console.log("response load data", response);
      const {content : rows, totalElements} = response.data;
      setRows(rows);
      setTotalElements(totalElements);
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
  /*-    let url = `/carreras-programas/${toDelete}`;
      const response = await DnerhsApi.delete(url, {
        cancelToken: source.token,
      });
      console.log("response delete", response); */
        Alert.show({
          message: "Registro eliminado exitosamente.",
          type: "success",
        });
   //     await loadData({ page, rowsPerPage });
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
              {`Solicitud de Asignación de Plazas`}
            </Typography>
            `
            <Table size="small">
              <TableHead>
                <TableRow>
                  {/* <TableCell align="left">Código</TableCell> */}
                  <TableCell align="center">Nro.</TableCell>

                  <TableCell align="center">Año</TableCell>
                  <TableCell align="left">Carrera / Programa</TableCell>
                  <TableCell align="left">Establecimiento</TableCell>
                  <TableCell align="left">Region Sanitaria</TableCell>
                  <TableCell align="left">Insititución Formadora</TableCell>

                  <TableCell align="left">Plazas solicitadas</TableCell>
                  <TableCell align="left">Estado Solicitud</TableCell>

                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {/* <TableCell align="left">{row.id}</TableCell> */}
                    <TableCell align="center">{row.id}</TableCell>

                    <TableCell align="center">{row.anio}</TableCell>
                    <TableCell align="left">{row.carreraprograma.descripcion}</TableCell>
                    <TableCell align="left">{row.datosEstablecimiento.institucionEstablecimiento.nombreServicio.nombre}</TableCell>
                    <TableCell align="left">{row.datosEstablecimiento.regionSanitaria.region}</TableCell>
                    <TableCell align="left">{row.convenio.institucionFormadora.institucion}</TableCell>
                    <TableCell align="left">{row.lugaresSolicitados}</TableCell>
                    <TableCell align="left">{row.estado}</TableCell>
                    
                    <TableCell align="center">
                      {isAdmin && (
                        <Tooltip title={row.estado!='Pendiente'? "Ver":"Asignar"} aria-label="asignar">
                          <IconButton
                            size="small"
                            aria-label="asignar"
                            color="primary"
                            onClick={() => history.push({
                              pathname: `/convenios/asignacionPlazas/solicitudes/crear/${row.id}`,
                              state: {
                                readOnly: true
                              }
                            })}
                          >
                            {row.estado!='Pendiente'? <VisibilityIcon />:<CompareArrowsIcon />}
                          </IconButton>
                        </Tooltip>
                      )}
                       {!isAdmin && (
                        <Tooltip title={row.estado!='Rechazado por DNERHS'? "Ver":"Editar"} aria-label="asignar">
                          <IconButton
                            size="small"
                            aria-label="asignar"
                            color="primary"
                            onClick={() => history.push({
                              pathname: `/convenios/asignacionPlazas/solicitudes/ver/${row.id}`,
                              state: {
                                readOnly: true
                              }
                            })}
                          >
                            {row.estado!='Rechazado por DNERHS'? <VisibilityIcon />:<EditIcon />}
                          </IconButton>
                        </Tooltip>
                      )}
                      
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    colSpan={3}
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
                  onClick={() => history.goBack()}
                >
                  Atrás
                </Button>
              </Grid>
              {!isAdmin && (
                <Grid item className={classes.button}>
                  <Link
                    to={`/convenios/asignacionPlazas/solicitudes/crear/${params.convenioId}`}
                  >
                    <Fab color="primary" aria-label="nuevo">
                      <Tooltip title="Nueva carrera" aria-label="nuevo">
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
    </Grid>
  );
};

export default List;
