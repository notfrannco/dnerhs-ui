import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, Grid, makeStyles,Button } from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import DnerhsApi, { CancelToken } from "../../api/DnerhsApi";
import moment from "moment";
import { Link } from "react-router-dom";
import Header from "components/Header";

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(7),
    paddingLeft: theme.spacing(16),
    paddingRight: theme.spacing(16),
  },
  appBarSpacer: theme.mixins.toolbar,
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

  const loadData = async ({ page = 0, rowsPerPage = 10 }) => {
    let source = CancelToken.source();
    try {
      let url = "/convenios/vigentes";
      const response = await DnerhsApi.get(url, {
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
    <>
      <Header />
      <div className={classes.appBarSpacer}>
        <div className={classes.main}>
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
                  Listado de convenios firmados vigentes
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Institución Formadora</TableCell>
                      <TableCell align="left">Sede</TableCell>
                      <TableCell align="left">Categoría</TableCell>
                      <TableCell align="left">Carreras o programas</TableCell>
                      <TableCell align="left">Inicio Vigencia</TableCell>
                      <TableCell align="left">Fin Vigencia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          {row.institucionFormadora}
                        </TableCell>
                        <TableCell align="left">
                          {row.sede}
                        </TableCell>
                        <TableCell align="left">{row.categoria}</TableCell>
                        <TableCell align="left">{row.carreras}</TableCell>
                        <TableCell align="left">{moment(row.fechaInicioVigencia).format("DD/MM/YYYY")}</TableCell>
                        <TableCell align="left">{moment(row.fechaFinVigencia).format("DD/MM/YYYY")}
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
              </Box>
            </Paper>
          </Grid>
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
                  to={`/login`}
                >
                  Atrás
                </Button>
              </Grid>
            </Grid>
        </Grid>
        </div>
       
      </div>
    </>
  );
};

export default List;
