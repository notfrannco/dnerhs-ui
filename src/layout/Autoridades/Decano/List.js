import React, { useEffect, useState } from "react";
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
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DnerhsApi, { CancelToken } from "../../../api/DnerhsApi";
import { Link, useParams } from "react-router-dom";
import history from "../../../utils/History";
import useAuth from "../../../hooks/Auth";
import Roles from "../../../constants/Roles";
import VisibilityIcon from '@material-ui/icons/Visibility';

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
  const { hasRole } = useAuth();
  const params = useParams();

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
      let url = `/convenios/${params.convenioId}/decanos`;
      //let url = `/convenios/${params.convenioId}/carreras-programas?page=${page}&pageSize=${rowsPerPage}`;
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
              Decanos / Directores Coordinadores
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {/* <TableCell align="left">Código</TableCell> */}
                  <TableCell align="left">Carrera</TableCell>
                  <TableCell align="left">CI</TableCell>
                  <TableCell align="left">Nombres</TableCell>
                  <TableCell align="left">Apellidos</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {/* <TableCell align="left">{row.id}</TableCell> */}
                    <TableCell align="left">{row.decano.carrera}</TableCell>
                    <TableCell align="left">
                      {row.decano.persona.cedulaIdentidad}
                    </TableCell>
                    <TableCell align="left">
                      {row.decano.persona.nombre}
                    </TableCell>
                    <TableCell align="left">
                      {row.decano.persona.apellido}
                    </TableCell>
                    <TableCell align="center">
                      {hasRole(Roles.ROLE_DNERHS) ? (
                        <Tooltip title="Ver" aria-label="ver">
                          <IconButton
                            size="small"
                            aria-label="ver"
                            color="primary"
                            onClick={() =>
                              history.push(`/decanos/ver/${row.id}`)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Editar" aria-label="editar">
                          <IconButton
                            size="small"
                            aria-label="editar"
                            color="primary"
                            onClick={() =>
                              history.push(`/decanos/ver/${row.id}`)
                            }
                          >
                            <EditIcon />
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
                    colSpan={5}
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
                  component={Link}
                  to={`/autoridades/${params.convenioId}`}
                >
                  Atrás
                </Button>
              </Grid>
              {hasRole(Roles.ROLE_USER) && (
                <Grid item className={classes.button}>
                  <Link to={`/decanos/crear/${params.convenioId}`}>
                    <Fab color="primary" aria-label="nuevo">
                      <Tooltip title="Nuevo decano/director" aria-label="nuevo">
                        <AddIcon />
                      </Tooltip>
                    </Fab>
                  </Link>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
