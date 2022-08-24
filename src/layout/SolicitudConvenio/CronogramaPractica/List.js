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
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DnerhsApi, { CancelToken } from "../../../api/DnerhsApi";
import { Link, useParams } from "react-router-dom";
import DeleteDialog from "../../../dialogs/DeleteDialog";
import history from "../../../utils/History";
import Alert from "../../../components/Alert";
import ResponseUtils from "../../../utils/ResponseUtils";
import useAuth from "../../../hooks/Auth";
import Roles from "../../../constants/Roles";
import EstadosCronograma from "../../../constants/EstadosCronograma";
import {Modal,Backdrop, TextareaAutosize } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(),
  },
  modal: {
    position:'absolute',
    width: 800,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'white',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,2),
    //padding: "30px 80px 60px",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    focus:{
      outline: 'none'
  },outline: 'none'
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
  const { hasRole, hasAnyRole } = useAuth();
  const params = useParams();
  const [observacion, setRechazoObservacion] = useState();
  const [idFinalizar, setIdFinalizar] = useState();

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
      let url = `/convenios/${params.convenioId}/practicas/page/?page=${page}&pageSize=${rowsPerPage}`;
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

  const deleteOne = async () => {
    let source = CancelToken.source();
    try {
      let url = `/convenios/practicas/${toDelete}`;
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

  const handleOpenDialog = (id) => {
    setOpenDialog(true);
    setToDelete(id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const confirmOne = async () => {
    abrirCerrarModal();
    try {
      if (observacion == "") {
        Alert.show({
          message : "Por favor ingrese una observación",
          type : "error"
        });
        return;
      }

      await DnerhsApi.post(
        `/convenios/practicas/${idFinalizar}/finalizar-cronograma?observacion=${observacion}`
      );

      Alert.show({
        message: "Solicitud de revisión enviada exitosamente.",
        type: "success",
      });

     
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
       } 
    }
    history.goBack();
    setOpenDialog(false);

  };

  /*MODAL*/
  const [modal, setModal]=useState(false);
  const abrirCerrarModal =(id)=>{
    setModal(!modal);
    setIdFinalizar(id);
  }
    const cerrarModal =()=>{  
    setModal(!modal);    
  }
  const handleObservacionChange = ( value) => {
    //rechazoObservacion=value;
    setRechazoObservacion(value);
  };
  //  <Box sx={classes.box}>
  const bodyModal= (
    
    <div className={classes.modal} align="center" classes={{focused: classes.outlinedInputFocused}}>
        <Card>
        <CardContent>
          <div>
          <Typography align="center" variant="h5" color="primary">
          Observaciones Cronograma
              </Typography>
      
              <br/> <br/>
  
          </div>
          <br/> <br/>
          <TextareaAutosize aria-label="Observacion"  rows={6} rowsMax={10} style={{ width: 600 }} placeholder="Observaciones" onChange={(e) =>
                                  handleObservacionChange(e.target.value)}/>
          <br/> <br/>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
        
           
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="default"
                onClick={()=>cerrarModal()}>Cancelar
              </Button>
            </Grid>
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={confirmOne}
                >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
    
  )
 
  const showEditButton = (row) =>
    row.estado === EstadosCronograma.CREADA ||
    row.estado === EstadosCronograma.PRACTICA_RECHAZADA//, ||
   // row.estado === EstadosCronograma.PRACTICA_APROBADA ||
   // row.estado === EstadosCronograma.PRACTICA_MODIFICACIONES_APROBADA
    ;

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
              Cronogramas de Prácticas
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                <TableCell align="left">Nro. Cronograma</TableCell>

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
                      {row.id}
                    </TableCell>
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

                      {hasRole(Roles.ROLE_USER) &&
                        <>
                          {showEditButton(row) ? 
                            <Tooltip title="Editar" aria-label="editar">
                              <IconButton
                                size="small"
                                aria-label="editar"
                                color="primary"
                                onClick={() => history.push({
                                  pathname: `/convenios/cronogramasPracticas/editar/${params.convenioId}/${row.id}`,
                                  state: {
                                    edit: true

                                  }
                                })}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          :
                            <Tooltip title="Ver" aria-label="Ver">
                              <IconButton
                                size="small"
                                aria-label="ver"
                                color="default"
                                onClick={() => history.push({
                                  pathname: `/convenios/cronogramasPracticas/ver/${params.convenioId}/${row.id}`,
                                  state: {
                                    readOnly: true
                                  }
                                })}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                        }

                          
                        </>
                      }

                      {hasAnyRole([Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]) &&
                        <>
                          <Tooltip title="Ver" aria-label="Ver">
                            <IconButton
                              size="small"
                              aria-label="ver"
                              color="primary"
                              onClick={() => history.push({
                                pathname: `/convenios/cronogramasPracticas/ver/${params.convenioId}/${row.id}`,
                                state: {
                                  readOnly: true,
                                  aprobar: row.estado === EstadosCronograma.PENDIENTE_APROBACION 
                                          || row.estado === EstadosCronograma.PRACTICA_PENDIENTE_MODIFICACIONES_APROBACION
                                }
                              })}
                            >
                              <VisibilityIcon />
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
              {hasRole(Roles.ROLE_USER) && (
                <Grid item className={classes.button}>
                  <Link to={`/convenios/cronogramasPracticas/crear/${params.convenioId}`}>
                    <Fab color="primary" aria-label="nuevo">
                      <Tooltip title="Nuevo dato estadistico de estudiantes" aria-label="nuevo">
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
        <Modal backdrop="static"
        open={modal} variant="standard"
        InputProps={{
                disableUnderline: true,
              }}
              style={{outline: 'none'}}
              classes={{focused: classes.outlinedInputFocused}}
      >
      
        {bodyModal}
      </Modal>
      </Grid>
    </Grid>
  );
};

export default List;
