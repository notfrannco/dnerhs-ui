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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Link } from "react-router-dom";
import DnerhsApi, { CancelToken } from "../../api/DnerhsApi";

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
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

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
  }, [status]);

  const loadData = async ({ page = 0, rowsPerPage = 10 }) => {
    let source = CancelToken.source();
    try {
      let url;
      if (status === "") {
        url = "/instituciones/formadoras/responsables";
      } else {
        url = `/instituciones/formadoras/responsables/estado=${status}`;
      }
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
    setStatus(event.target.value);
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
                  value={status}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Ninguno</em>
                  </MenuItem>
                  <MenuItem value="Solicitud pendiente de autorización por DNERHS">
                    Solicitud pendiente de autorización por DNERHS
                  </MenuItem>
                  <MenuItem value="Solicitud aprobada por DNERHS">
                    Solicitud aprobada por DNERHS
                  </MenuItem>
                  <MenuItem value="Solicitud rechazada por DNERHS">
                    Solicitud rechazada por DNERHS
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Fecha de Solicitud</TableCell>
                  <TableCell align="left">Institución Formadora</TableCell>
                  <TableCell align="left">Sede</TableCell>
                  <TableCell align="left">CI Responsable</TableCell>
                  <TableCell align="left">Nombre Responsable</TableCell>
                  <TableCell align="left">Apellido Responsable</TableCell>
                  <TableCell align="left">Estado Solicitud</TableCell>
                  <TableCell align="center">Accion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.fechaCreacion}</TableCell>
                    <TableCell align="left">
                      {row.formadora.institucion}
                    </TableCell>
                    <TableCell align="left">{row.formadora.sede}</TableCell>
                    <TableCell align="left">
                      {row.responsable.cedulaIdentidad}
                    </TableCell>
                    <TableCell align="left">
                      {row.responsable.nombres}
                    </TableCell>
                    <TableCell align="left">
                      {row.responsable.apellidos}
                    </TableCell>
                    <TableCell align="left">{row.estado}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver" aria-label="ver">
                        <IconButton
                          size="small"
                          aria-label="ver"
                          color="secondary"
                          component={Link}
                          to={`/responsable/revision/${row.id}`}
                          //disabled={row.estado !== "PENDIENTE"}
                        >
                          <VisibilityIcon />
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
