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
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DnerhsApi, { CancelToken } from "../../../api/DnerhsApi";
import { Link, useParams } from "react-router-dom";
import history from "../../../utils/History";
import Alert from "../../../components/Alert";
import ResponseUtils from "../../../utils/ResponseUtils";
import useAuth from "../../../hooks/Auth";
import Roles from "../../../constants/Roles";
import ListIcon from '@material-ui/icons/List';

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
      let url = `/convenios/${params.convenioId}/practicas/aprobadas/page/?page=${page}&pageSize=${rowsPerPage}`;
      const response = await DnerhsApi(url, {
        cancelToken: source.token,
      });
      const { content, totalElements } = response.data;
      setRows(content);
      setTotalElements(totalElements);
    } catch (error) {
      console.log(error);
      if (error.response) {
        showServerError(error);
      }
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
              Prácticas
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Carrera</TableCell>
                  <TableCell align="left">Materia</TableCell>
                  <TableCell align="left">Curso</TableCell>
                  <TableCell align="left">Semestre</TableCell>
                  <TableCell align="left">Estado</TableCell>
                  <TableCell align="left">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      {row.convenioCarrera?.carreraPrograma.descripcion}
                    </TableCell>
                    <TableCell align="left">
                      {row.materia}
                    </TableCell>
                    <TableCell align="left">
                      {row.curso}
                    </TableCell>
                    <TableCell align="left">
                      {row.semestre}
                    </TableCell>
                    <TableCell align="left">
                      {row.estado}
                    </TableCell>
                    <TableCell align="left">

                        <>
                          <Tooltip title="Confirmar Asistencias" aria-label="Ver">
                            <IconButton
                              size="small"
                              aria-label="confirmar asistencias"
                              color="primary"
                              onClick={() => history.push({
                                pathname: `/convenios/confirmacionesPracticas/confirmar/${row.id}`,
                                state: {
                                  readOnly: true
                                }
                              })}
                            >
                              <ListIcon />
                            </IconButton>
                          </Tooltip>
                        </>
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
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
