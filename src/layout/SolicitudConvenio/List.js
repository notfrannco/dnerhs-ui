import React, { useContext, useEffect, useState } from "react";
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
  Button
} from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import DnerhsApi, { CancelToken } from "../../api/DnerhsApi";
import { Link } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import UserContext from "../../context/User/UserContext";
import history from "../../utils/History";
import { getSedeSeleccionada } from "services/UsuarioService";
import Roles from "constants/Roles";

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
  const [open, setOpen] = React.useState(false);
  const { userData, hasRole } = useContext(UserContext);
  const [status, setStatus] = useState("");

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
      if (hasRole(Roles.ROLE_DNERHS)) {
        if (status === "") {
          url = `/convenios`;
        } else {
          url = `/convenios/estado=${status}`;
        }
      } else {
        const datosInstitucion = getSedeSeleccionada();
        if (status === "") {
          url = `/instituciones/formadoras/${datosInstitucion?.formadora?.id}/convenios`;
        } else {
          url = `/instituciones/formadoras/${datosInstitucion?.formadora?.id}/convenios/estado=${status}`;
        }
      }
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
              Convenios con el MSPBS
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
                  <MenuItem
                    value={"Convenio en proceso de creación por el responsable"}
                  >
                    Convenio en proceso de creación por el responsable
                  </MenuItem>
                  <MenuItem value={"Convenio pendiente de revisión por DNERHS"}>
                    Convenio pendiente de revisión por DNERHS
                  </MenuItem>
                  <MenuItem
                    value={"Convenio con correcciones solicitadas por DNERHS"}
                  >
                    Convenio con correcciones solicitadas por DNERHS
                  </MenuItem>
                  <MenuItem value={"Convenio pendiente de firma"}>
                    Convenio pendiente de firma
                  </MenuItem>
                  <MenuItem value={"Convenio firmado"}>
                    Convenios firmados
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    Fecha de creación de solicitud
                  </TableCell>
                  <TableCell align="left">Institución Formadora</TableCell>
                  <TableCell align="left">Sede</TableCell>
                  <TableCell align="left">Categoría</TableCell>
                  <TableCell align="left">Estado</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.fechaCreacion}</TableCell>
                    <TableCell align="left">
                      {row.institucionFormadora.institucion}
                    </TableCell>
                    <TableCell align="left">
                      {row.institucionFormadora.sede}
                    </TableCell>
                    <TableCell align="left">{row.categoria}</TableCell>
                    <TableCell align="left">{row.estado}</TableCell>
                    <TableCell align="center">
                      <Link to={`/convenios/editar/${row.id}`}>
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
              spacing={2}
              alignItems="center"
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="default"
                 onClick={() => history.goBack()}
                >
                  Atrás
                </Button>
              </Grid>
              {!hasRole(Roles.ROLE_DNERHS) && (<Grid item>
                <Link to="/convenios/crear">
                  <Fab color="primary" aria-label="nuevo">
                    <Tooltip title="Nuevo Convenio" aria-label="nuevo">
                      <AddIcon />
                    </Tooltip>
                  </Fab>
                </Link>
              </Grid>)}
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
