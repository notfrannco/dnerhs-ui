import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { Box, Grid, makeStyles } from "@material-ui/core/";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import DnerhsApi, { CancelToken } from "../../../../api/DnerhsApi";
import useAuth from "../../../../hooks/Auth";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { findById } from "../../../../constants/Meses";
import { useParams } from "react-router-dom";
import { formatToLocale } from "../../../../utils/NumbersUtils";

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  form: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  field: {
    padding: theme.spacing(),
  },
  large: {
    width: theme.spacing(16),
    height: theme.spacing(16),
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
  const [establecimientoId, setEstablecimientoId] = useState();

  
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
  const getEstablecimiento = async () => {
    const { data } = await DnerhsApi.get("/instituciones/establecimientos/responsables/info");
    setEstablecimientoId(data.id);
  }
  
  const loadData = async ({ page = 0, rowsPerPage = 10 }) => {
    let source = CancelToken.source();
    try {
      if(typeof(establecimientoId) === 'undefined' || establecimientoId===''){
        getEstablecimiento();
      }
      let url =
        `/instituciones/establecimientos/${establecimientoId}/practicas/page?page=` +
        page +
        "&pageSize=" +
        rowsPerPage;
      const response = await DnerhsApi(url, {
        cancelToken: source.token,
      });
      response.data.forEach((k)=>{
        k.practicaDetalleHorarioList.forEach((ho)=>{
          console.log(ho);
          if(ho.dia=="1"){ 
            k.lunes=true;
          }
          if(ho.dia=="2"){ 
            k.martes=true;
          }
          if(ho.dia=="3"){ 
            k.miercoles=true;
          }
          if(ho.dia=="4"){ 
            k.jueves=true;
          }
          if(ho.dia=="5"){ 
            k.viernes=true;
          }
          if(ho.dia=="6"){ 
            k.sabado=true;
          }
          if(ho.dia=="7"){ 
            k.domingo=true;
          }
        });
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
              Cronograma de Practicas
            </Typography>
            <TableContainer>
              <Table aria-label="Datos estadisticos">
                <TableHead>
                  <TableRow>
                  <TableCell align="center">Alumno</TableCell>

                    <TableCell align="center">C.I. Alumno</TableCell>
                    <TableCell align="right">Año</TableCell>
                    <TableCell align="right">D</TableCell>
                    <TableCell align="right">L</TableCell>
                    <TableCell align="right">M</TableCell>
                    <TableCell align="right">X</TableCell>
                    <TableCell align="right">J</TableCell>
                    <TableCell align="right">V</TableCell>
                    <TableCell align="right">S</TableCell>
                    <TableCell align="right">Total Horas</TableCell>
                    <TableCell align="right">Tutor</TableCell>

                    <TableCell align="right">C.I. Tutor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                          {row.convenioEstudiante?.estudiante.nombres}&nbsp;{row.convenioEstudiante?.estudiante.apellidos}
                        </TableCell>
                      <TableCell align="center">
                        {formatToLocale(row.convenioEstudiante?.estudiante?.cedulaIdentidad)}
                      </TableCell>
                      <TableCell align="right">{row.anio}</TableCell>
                      
                      <TableCell align="right">
                        {row.domingo ? (
                          <CheckIcon color="secondary" />
                        ) : (
                          <CloseIcon color="primary" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.lunes ? (
                          <CheckIcon color="secondary" />
                        ) : (
                          <CloseIcon color="primary" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.martes ? (
                          <CheckIcon color="secondary" />
                        ) : (
                          <CloseIcon color="primary" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.miercoles ? (
                          <CheckIcon color="secondary" />
                        ) : (
                          <CloseIcon color="primary" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.jueves ? (
                          <CheckIcon color="secondary" />
                        ) : (
                          <CloseIcon color="primary" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.viernes ? (
                          <CheckIcon color="secondary" />
                        ) : (
                          <CloseIcon color="primary" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.sabado ? (
                          <CheckIcon color="secondary" />
                        ) : (
                          <CloseIcon color="primary" />
                        )}
                      </TableCell>
                    
                      <TableCell align="right">
                        {row.totalHoras + " hs"}
                      </TableCell>
                      <TableCell align="left">
                          {row.convenioTutor?.tutor?.nombres}&nbsp;{ row.convenioTutor?.tutor?.apellidos}
                        </TableCell>
                      <TableCell align="right">
                        {formatToLocale(row.convenioTutor?.tutor?.cedulaIdentidad)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10, 15, 20]}
                      colSpan={13}
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
            </TableContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default List;
