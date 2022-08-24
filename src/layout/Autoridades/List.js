import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, Button, Grid, makeStyles } from "@material-ui/core/";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import { Link, useParams } from "react-router-dom";
import history from "../../utils/History";
import Roles from "../../constants/Roles";
import useAuth from "../../hooks/Auth";

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
  const { hasRole } = useAuth();
  const params = useParams();

  const autoridades = [
    {
      id: 1,
      descripcion: "Rector o Director General",
      path: "/rector/crear",
    },
    {
      id: 2,
      descripcion:
        "Listado de Decanos o Directores Coordinadores por cada carrera o programa",
      path: "/decanos",
    },
  ];

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
              Datos de las autoridades de la institución formadora
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Autoridad</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {autoridades.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.descripcion}</TableCell>
                    <TableCell align="center">
                      {hasRole(Roles.ROLE_DNERHS) ?
                        <Tooltip title="Ver" aria-label="ver">
                          <IconButton
                            size="small"
                            aria-label="ver"
                            color="primary"
                            onClick={() => history.push(`${row.path}/${params.convenioId}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        :
                        <Tooltip title="Editar" aria-label="editar">
                          <IconButton
                            size="small"
                            aria-label="editar"
                            color="primary"
                            onClick={() => history.push(`${row.path}/${params.convenioId}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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
                  to={`/convenios/editar/${params.convenioId}`}
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
