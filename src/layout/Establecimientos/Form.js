import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import history from "../../utils/History";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import useAuth from "../../hooks/Auth";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Roles from "../../constants/Roles";
import DnerhsApi from "api/DnerhsApi";

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
    margin: theme.spacing(),
  },
}));


const secciones = [
  {
    id: 1,
    descripcion: "Datos generales del campo de práctica",
    estado: "Datos cargados",
    path: "/establecimientos/camposPractica/crear",
  },
  {
    id: 2,
    descripcion: "Datos del encargado del campo de práctica",
    estado: "3 Carreras/Programas cargadas",
    path: "/establecimientos/encargadoCamposPractica/crear",
  },
  {
    id: 3,
    descripcion: "Infraestructura",
    estado: "Sin carga",
    path: "/establecimientos/capacidadCamposPractica/crear",
  },
  {
    id: 4,
    descripcion: "Profesional de salud",
    estado: "Sin carga",
    path: "/establecimientos/profesionalCamposPractica/crear",
  },
  {
    id: 5,
    descripcion: "Cartera de Servicios",
    estado: "Datos cargados",
    path: "/establecimientos/servicioCamposPractica/crear",
  },
  {
    id: 6,
    descripcion: "Plazas disponibles",
    estado: "Datos cargados",
    path: "/establecimientos/plazaCamposPractica/crear",
  },
  {
    id: 7,
    descripcion: "Cronogramas aprobados",
    estado: "Datos cargados",
    path: "/establecimientos/cronograma/aprobados",
  },
];

const Form = () => {
  const classes = useStyles();
  const params = useParams();
  const [establecimientoId, setEstablecimientoId] = useState();
  const { hasRole } = useAuth();

  useEffect(() => {
    let {establecimientoId} = params;
    if (establecimientoId) {
      setEstablecimientoId(establecimientoId);
    }else {
      getEstablecimiento();    
    }
  }, []);


  const getEstablecimiento = async () => {
    const { data } = await DnerhsApi.get("/instituciones/establecimientos/responsables/info");
    setEstablecimientoId(data.id);
  }
  

  const handleClickEditar = (row) => {
    if(row.path==="/establecimientos/cronograma/aprobados"){
      history.push({
        pathname : `${row.path}`,
        state : {
          readOnly : false
        }
      })
    }else{
      history.push({
        pathname : `${row.path}/${establecimientoId}`,
        state : {
          readOnly : false
        }
      })
    }
  }

  const handleClickVer = (row) => {
    history.push({
      pathname : `${row.path}/${establecimientoId}`,
      state : {
        readOnly : true
      }
    })
  }

  return (
    <>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Establecimiento
        </Typography>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper>
            <Box p={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Secciones</TableCell>
                    <TableCell align="right" />
                    {/* <TableCell align="left">Estado</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secciones.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        {row.descripcion}
                      </TableCell>
                      <TableCell align="right">
                      {
                        (hasRole(Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO)) &&
                        <Tooltip title="Editar" aria-label="editar">
                          <IconButton
                            aria-label="editar"
                            color="primary"
                          >
                            <EditIcon
                              onClick={() => handleClickEditar(row)}
                            />
                          </IconButton>
                        </Tooltip>
                      }
                      {
                        (hasRole(Roles.ROLE_DNERHS)) &&
                        <Tooltip title="Ver" aria-label="ver">
                        <IconButton
                          aria-label="editar"
                          color="primary"
                        >
                          <VisibilityIcon
                            onClick={() => handleClickVer(row)}
                          />
                        </IconButton>
                      </Tooltip>
                      }
                       
                      </TableCell>
                      {/* <TableCell align="left">{row.estado}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="flex-end" alignItems="center">
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            onClick={() => history.goBack()}
          >
            Atrás
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Form;
