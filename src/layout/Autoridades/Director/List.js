import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, Grid } from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
//import DnerhsApi, { CancelToken } from "../../api/DnerhsApi";
import { Link } from "react-router-dom";

const List = () => {
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

  const loadData = () => {
    let rows = [
      {
        nombre: "Ana",
        apellido: "Benitez",
        genero: "Femenino",
        nacionalidad: "Paraguaya",
        telefono: "021-465887",
        email: "ab@une.edu.py",
        cargo: "Director"
      },
      {
        nombre: "Arami",
        apellido: "Godoy",
        genero: "Femenino",
        nacionalidad: "Paraguaya",
        telefono: "021-254796",
        email: "ag@unca.edu.py",
        cargo: "Director"
      },
      {
        nombre: "Miguel",
        apellido: "Alonso",
        genero: "Masculino",
        nacionalidad: "Paraguaya",
        telefono: "021-254178",
        email: "ma@upe.edu.py",
        cargo: "Director"
      },
    ];
    setRows(rows);
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
            <Typography variant="h5" color="primary">
              Directores
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Nombre</TableCell>
                  <TableCell align="left">Apellido</TableCell>
                  <TableCell align="center">Género</TableCell>
                  <TableCell align="center">Nacionalidad</TableCell>
                  <TableCell align="center">Teléfono</TableCell>
                  <TableCell align="center">E-mail</TableCell>
                  <TableCell align="center">Cargo</TableCell>
                  <TableCell align="center">Accion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.nombre}</TableCell>
                    <TableCell align="left">{row.apellido}</TableCell>
                    <TableCell align="center">{row.genero}</TableCell>
                    <TableCell align="center">{row.nacionalidad}</TableCell>
                    <TableCell align="center">{row.telefono}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.cargo}</TableCell>
                    {/* <TableCell align="left">
                      {row.tipoInstitucion.descripcion}
                    </TableCell> */}
                    <TableCell align="center">
                      <Tooltip title="Editar" aria-label="editar">
                        <IconButton
                          size="small"
                          aria-label="editar"
                          color="primary"
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
                          //onClick={() => console.log("prueba eliminar")}
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
              <Grid item>
                <Link to="/director/crear">
                  <Fab color="primary" aria-label="nuevo">
                    <Tooltip title="Nuevo Director" aria-label="nuevo">
                      <AddIcon />
                    </Tooltip>
                  </Fab>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
