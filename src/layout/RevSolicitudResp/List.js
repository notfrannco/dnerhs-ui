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
  Fab,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Tooltip,
} from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import DnerhsApi, { CancelToken } from "../../api/DnerhsApi";
import { Link } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
  const [rows, setRows] = useState([]);
  const [age, setAge] = React.useState("");
  const [open, setOpen] = React.useState(false);

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
      let url =
        "/encargados-institucion?page=" + page + "&pageSize=" + rowsPerPage;
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

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
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
              Solicitudes de Responsables de Instituciones Formadoras
            </Typography>
            <Grid item xs={6}>
              <FormControl
                className={classes.formControl}
                variant="outlined"
                fullWidth
              >
                <InputLabel id="demo-controlled-open-select-label">
                  Estado
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  label="Estado"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  value={age}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Ninguno</em>
                  </MenuItem>
                  <MenuItem value={1}>Pendientes de Aprobación</MenuItem>
                  <MenuItem value={2}>Aceptadas</MenuItem>
                  <MenuItem value={3}>Rechazadas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Fecha</TableCell>
                  <TableCell align="left">Institución</TableCell>
                  <TableCell align="left">CI</TableCell>
                  <TableCell align="left">Nombres</TableCell>
                  <TableCell align="left">Apellidos</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.fecha}</TableCell>
                    <TableCell align="left">
                      {row.sedeInstitucion.institucion.nombre}
                    </TableCell>
                    <TableCell align="left">
                      {row.persona.cedulaIdentidad}
                    </TableCell>
                    <TableCell align="left">{row.persona.nombre}</TableCell>
                    <TableCell align="left">{row.persona.apellido}</TableCell>
                    <TableCell align="center">
                      <Link to="/responsable/crear">
                        <Fab color="primary" aria-label="ver" size="small">
                          <Tooltip title="Ver" aria-label="ver">
                            <VisibilityIcon />
                          </Tooltip>
                        </Fab>
                      </Link>
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
    </Grid>
  );
};

export default List;
