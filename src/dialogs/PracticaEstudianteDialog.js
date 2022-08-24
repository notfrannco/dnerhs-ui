import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import {
  Box,
  Button,
  Grid,Modal,Backdrop, TextareaAutosize 
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import FormInput from "../Controls/Input";
import FormSelect from "../Controls/Select";
import FormCheckBox from "../Controls/Checkbox";
import FormAutocomplete from "../Controls/Autocomplete";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import { FormProvider, useForm } from "react-hook-form";
import useAuth from "../hooks/Auth";
import Roles from "../constants/Roles";
import { Meses } from "../constants/Meses";
import Alert from "../components/Alert";
import FormDatePicker from "../Controls/DatePicker";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeleteDialog from "dialogs/DeleteDialog";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  styleItem: {
    height: "100%",
    width: "100%",
    overflow: "auto",
  },
  field: {
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
  }
}));
let contador = 1;
const DIAS_SEMANA2 = [
  {
    id: 1,
    label: "lunes",
  },
  {
    id: 2,
    label: "martes",
  },
  {
    id: 3,
    label: "miercoles",
  },
  {
    id: 4,
    label: "jueves",
  },
  {
    id: 5,
    label: "viernes",
  },
  {
    id: 6,
    label: "sabado",
  },
  {
    id: 7,
    label: "domingo",
  },
];

const validationSchema = yup.object().shape({
  convenioEstudiante: yup.object().required("El campo estudiante es requerido"),
  anio: yup.number().required("El campo año es requerido"),
 fechaDesdeModal: yup.string().required("El campo horario desde es requerido"),
  fechaHastaModal: yup.string().required("El campo horario hasta es requerido"),
  totalHoras: yup.number().required("El campo total horas es requerido"),
  convenioTutor: yup.object().required("El campo tutor es requerido"),
  establecimiento: yup.object().required("El campo establecimiento es requerido"),
});
export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [mesesOptions, setMesesOptions] = useState([]);
  const methods = useForm({
    shouldUnregister:false,
    resolver: yupResolver(validationSchema)
  });
  const { handleSubmit, setValue, reset, errors , getValues} = methods;
  const { hasRole } = useAuth();  
  const methods2 = useForm({
    shouldUnregister: false,
    //  resolver: yupResolver(validationSchema),
  });
  const {  handleSubmit: handleSubmit2,   errors: errors2,  reset: reset2, setValue:getValues2, getValues:getValues3 } = methods2;

  useEffect(() => {
    reset();
    setForEdit();
    setDeshabilitarAgregar(true);
    const formValues = {
      fechaDesdeModal: props.fechaDesde,
      fechaHastaModal: props.fechaHasta,
      anio: props.curso

    }
    Object.keys(formValues).forEach((field) => {
      setValue(field, formValues[field]);
    });  
    setTimeDesde("00:00");
    setTimeHasta("00:00");
    
    reset2();
    
  }, [props.dataForEdit]);
 const [horariosElegido, setHorariosElegido] = useState([]);
 const [plazaElegida, setPlazaElegida] = useState();

 const [timeDesde, setTimeDesde] = useState("00:00");
 const [timeHasta, setTimeHasta] = useState("00:00");
 const [horarios, setHorarios] = useState([]);
 const [deshabilitarAgregar, setDeshabilitarAgregar] = useState(true);
 const [fechaDesdeModal, setFechaDesdeModal] = useState();
 const [fechaHastaModal, setFechaHastaModal] = useState();
 const DIAS_SEMANA = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
 const [toDelete, setToDelete] = useState();
 const [openDialog, setOpenDialog] = useState(false);
  const setForEdit = () => {
    if (Object.entries(props.dataForEdit).length > 0) {
      let { dataForEdit: practica } = props;

      const formValues = {
        cedulaIdentidad: practica.cedulaIdentidad,
        convenioEstudiante : practica.convenioEstudiante,
        nombres: practica.nombres,
        apellidos: practica.apellidos,
        anio: practica.anio,
        totalHoras: practica.totalHoras,
        convenioTutor: practica.convenioTutor,
        establecimiento: practica.solicitudPlaza,
        lunes: practica.lunes,
        martes: practica.martes,
        miercoles: practica.miercoles,
        jueves: practica.jueves,
        viernes: practica.viernes,
        sabado: practica.sabado,
        domingo: practica.domingo,
        fechaDesdeModal:practica.fechaDesde,
        fechaHastaModal:practica.fechaHasta
      };
      //setFechaDesdeModal(practica.fechaDesde);
      //setFechaHastaModal
      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });   

      setHorarios(practica.practicaDetalleHorarioList);
    } 
    setDeshabilitarAgregar(false);
  }

  const loadMesesOptions = (meses) => {
    if (meses) {
      setMesesOptions(
        meses.map((mes) => ({
          label: mes.nombre,
          id: mes.id,
        }))
      );
    }
  }
  const converToLocalTime = (str)  => {
   var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);

    console.log(new Date(new Date([date.getFullYear(), mnth, day].join("-")).toString().split('GMT')[0]+' UTC').toISOString());

  //return [date.getFullYear(), mnth, day].join("-");
    return (new Date(new Date([date.getFullYear(), mnth, day].join("-")).toString().split('GMT')[0]+' UTC').toISOString());

 /* var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2),
        hours  = ("0" + date.getHours()).slice(-2),
        minutes = ("0" + date.getMinutes()).slice(-2),
                segundos = ("0" + date.getMinutes()).slice(-2);

    return [ date.getFullYear(), mnth, day, hours, minutes, segundos ].join("-");*/
  }
  const changeTimeDesde = (e) => {
    setTimeDesde(e.target.value)
  }
  const changeTimeHasta = (e) => {
    setTimeHasta(e.target.value)
  }
  const onSubmit = async (data) => {
    if(horarios.length<1){
      Alert.showError("La carga de Horarios es dato requerido");
    }else{
      let auxiliarSolicitud=getValues("establecimiento");
      data.solicitudPlaza=auxiliarSolicitud;
      data.establecimiento=auxiliarSolicitud.datosEstablecimiento.institucionEstablecimiento;
      data.practicaDetalleHorarioList= [];
      horarios.forEach((el)=>{
        console.log(el);
        let auxObjeto={
          "fechaCreacion": "21-02-2022 00:00:00",
          "idUsuarioCreacion": 1,
          "fechaModificacion": "21-02-2022 00:00:00",
          "idUsuarioModificacion": 1,                        
          "horarioDesde":el.horarioDesde,
          "horarioHasta": el.horarioHasta,
          "dia": el.dia
    
        }
        data.practicaDetalleHorarioList.push(auxObjeto);
        if(el.dia=="1"){ 
          data.lunes=true;
        }
        if(el.dia=="2"){ 
          data.martes=true;
        }
        if(el.dia=="3"){ 
          data.miercoles=true;
        }
        if(el.dia=="4"){ 
          data.jueves=true;
        }
        if(el.dia=="5"){ 
          data.viernes=true;
        }
        if(el.dia=="6"){ 
          data.sabado=true;
        }
        if(el.dia=="7"){ 
          data.domingo=true;
        }
      });     
  
var date = new Date(data.fechaDesdeModal.toString());
var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];

console.log(dateString);
      data.fechaDesde=converToLocalTime(data.fechaDesdeModal.toString());
      console.log(data.fechaDesdeModal);
      data.fechaHasta=converToLocalTime(data.fechaHastaModal.toString());
      let dataCopy = { ...data };   
      /*if (data.mesDesde > data.mesHasta) {
        Alert.show({ message: "El mes de inicio no puede ser posterior al mes de fin", type: "error" });
        return;
      }*/
      /*if (!DIAS_SEMANA.some(item => data[item])) {
        Alert.show({ message: "Debe seleccionar al menos un dia de la semana", type: "error" });
        return;
      }*/
      props.onSave(dataCopy);
    }
  }
  const onChangeSolicitud = (e, itemx) => {
    if(e!=null){
    let listCopy = [];
    setHorarios(listCopy);   
    reset2();  
    setDeshabilitarAgregar(false);
    setTimeDesde("00:00");
    setTimeHasta("00:00");
      reset2();
    }else{
      setDeshabilitarAgregar(true);

    }
  };

  const handleClose = () => {
    props.onClose();
  };
   /*MODAL*/
   const [modal, setModal]=useState(false);
   const abrirCerrarModal =()=>{
     setModal(!modal);     
   }
     const cerrarModal =()=>{
     setModal(!modal);     
   }
    //  <Box sx={classes.box}>
  const bodyModal= (
    
    <div className={classes.modal} align="center" classes={{focused: classes.outlinedInputFocused}}>
        <Card>
        <CardContent>
          <div>
        
              <Typography variant="h6" className={classes.title} >
              Horario Asignado Aprobado por DNERHS
            </Typography>
          
          </div>     
         
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">      
            <Grid item xs={12} className={classes.field}> 
              <Typography  align="center"
                                variant="h6"
                                color="primary">
                Carrera Seleccionada:
              </Typography>  
              <Typography  align="center"
                                variant="h6"
                                color="primary">
                 {plazaElegida?.carreraprograma?.descripcion}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.field} >                              
              <Typography align="center"
                                variant="h6"
                                color="primary">
                Establecimiento Seleccionado: 
              </Typography>  
              <Typography  align="center"
                                variant="h6"
                                color="primary">
               {plazaElegida?.datosEstablecimiento?.institucionEstablecimiento?.nombreServicio?.nombre}
              </Typography>  
            </Grid>
           
          </Grid> 
          <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table aria-label="Datos estadisticos">
                                  <TableHead>
                                    <TableRow>
                                      
                                      <TableCell align="center">Día</TableCell>
                                      <TableCell align="right">
                                        Horario Desde
                                      </TableCell>
                                      <TableCell align="right">
                                        Horario Hasta
                                      </TableCell>
                                      
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {horariosElegido
                                      .sort((a, b) =>
                                        a.anio > b.anio ? -1 : 1
                                      )
                                      .map((row, index) => (
                                        <TableRow key={index}>
                                        

                                          <TableCell align="center">
                                            {
                                              DIAS_SEMANA2.find(
                                                (item) => item.id == row.dia
                                              )?.label
                                            }
                                          </TableCell>
                                          <TableCell align="right">
                                            {row.horarioDesde}
                                          </TableCell>
                                          <TableCell align="right">
                                            {row.horarioHasta}
                                          </TableCell>
                                         
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>  
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">      
                   
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={()=>cerrarModal()}>OK
              </Button>
            </Grid>
            
          </Grid>
        </CardContent>
      </Card>
    </div>
    
  )
  const validar = (data) => {  
    const auxiliarPlazas =getValues("establecimiento");
    if(auxiliarPlazas!=null){
      setPlazaElegida(auxiliarPlazas);
      const horas=auxiliarPlazas.solicitudPlazaAsignacionList;
      setHorariosElegido(horas);
      //ver como llegar al listado de el seleccionado
      let bandera=false;
      if(timeDesde==="00:00" && timeHasta==="00:00" ){
        Alert.show({
          message : "Verifique el  horario de practica",
          type : "warning"
        })
        return false;
      }else{
        let contador=0;
        horas.forEach((el)=>{
          console.log(el);
          contador++;
          if(((data.dia).toString()) ==el.dia){
            let fecha1 = new Date('1/1/1990 '+ el.horarioDesde.toString());
            let fecha2 = new Date('1/1/1990 '+ timeDesde);
            let fecha3 = new Date('1/1/1990 '+ el.horarioHasta.toString());
            let fecha4 = new Date('1/1/1990 '+ timeHasta);
            if(((fecha2 >= fecha1)   &&  (fecha2 < fecha4))  &&  ((fecha4 <= fecha3)  &&  (fecha4 > fecha2))){
              bandera=true;
              console.log("ENTROOOOOOOOOOOO")
            }
          }
        });
        if(contador===horas.length){
          if(!bandera){
            abrirCerrarModal();
            Alert.show({
              message : "El Horario creado no coincide con el horario asignado de Plazas reservadas y aprobadas para esta carrera y establecimiento",
              type : "warning"
            })
            return false;
          }else{
            return true;
          }
        }
      }
    }else{
      Alert.show({ message:"No existe una solicitud y establecimientoseleccionado, Por favor Verifique.", type: "error" });  
      return false;
    }   
  }

  const getOptionLabelEstudiantes = (convenio) => {
    return  `${convenio.estudiante?.cedulaIdentidad} - ${convenio?.estudiante?.nombres} ${convenio?.estudiante?.apellidos}`;
  }

  const getOptionLabelTutores = (convenio) => {
    return  `${convenio.tutor?.cedulaIdentidad} - ${convenio?.tutor?.nombres} ${convenio?.tutor?.apellidos}`;
  }

  const getOptionLabelEstablecimientos = (solicitud) => {
    return `${solicitud?.nombreServicio?.nombre}`;
   //return `Nro. de Solicitud: ${solicitud?.id} - Establecimiento: ${solicitud?.datosEstablecimiento?.institucionEstablecimiento?.nombreServicio?.nombre}`;
  }
  const getOptionLabelPlazas = (solicitud) => {
   return `Nro. de Solicitud: ${solicitud?.id} - Establecimiento: ${solicitud?.datosEstablecimiento?.institucionEstablecimiento?.nombreServicio?.nombre}`;
  }
  const handleOpenDialog = (index) => {
    setOpenDialog(true);
    setToDelete(index);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteOne = async (index) => {
    let listCopy = [...horarios];
    listCopy.splice(index, 1);
    setHorarios(listCopy);
    setOpenDialog(false);
    setToDelete();
  };
  const onSubmit2 = async (data) => {    
  
    if(validar(data)){
        /*data.practicaDetalleHorarioList= [{
          "fechaCreacion": "21-02-2022 00:00:00",
          "idUsuarioCreacion": 1,
          "fechaModificacion": "21-02-2022 00:00:00",
          "idUsuarioModificacion": 1,                        
          "horarioDesde":"05:39:00",
          "horarioHasta": "08:39:00",
          "dia": "lunes"

        }*/          
        const resultado = {
          dia: data.dia,
          horarioDesde: timeDesde + ':00',
          horarioHasta: timeHasta     + ':00', 
        };
        setHorarios([...horarios, resultado]);
        setTimeDesde("00:00");
        setTimeHasta("00:00");
        reset2();      
    }
  };
/* <Grid item xs={12} className={classes.field}>
                            <FormInput
                              name="horarioHasta"
                              type="time"
                              defaultValue="00:00"
                              label="Horario hasta"
                              disabled={props.isReadOnly}
                              required
                              errorobj={errors}
                            />
                          </Grid> */
  return (
    <>
      <Dialog fullScreen open={props.open} onClose={handleClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Cronograma Práctica
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>
        <Box padding={3}>
          <Grid container>
            <Grid item xs={12}>
              <FormProvider {...methods}>
                <form>
                  <Grid container direction="row">
                    <Grid item xs={12}>
                      <Grid item xs={12} className={classes.field}>
                        <Typography align="left" variant="h6" color="primary">
                          Datos cronograma
                        </Typography>
                      </Grid>
                      <Grid container item xs={12}>
                        <Grid item xs={6}>
                          <Grid item xs={12} className={classes.field}>
                            <FormAutocomplete
                              options={props.estudiantesConvenioList}
                              getOptionLabel={getOptionLabelEstudiantes}
                              getOptionSelected={(option, value) =>
                                option.convenio.id === value.convenio.id &&
                                option.estudiante.id === value.estudiante.id
                              }
                              name="convenioEstudiante"
                              label="Estudiante"
                              disabled={props.isReadOnly}
                              required
                              errorobj={errors}
                            />
                          </Grid>
                          <Grid item xs={12} className={classes.field}>
                          <FormDatePicker name="fechaDesdeModal" label="Fecha desde" disabled/>
                        </Grid>
                        
                          <Grid item xs={12} className={classes.field}>
                            <FormInput
                              name="totalHoras"
                              type="number"
                              label="Total horas"
                              disabled={props.isReadOnly}
                              required
                              errorobj={errors}
                            />
                          </Grid>
                          <Grid item xs={12} className={classes.field}>
                            <FormAutocomplete
                         
                            
                              options={props.plazasList}
                              getOptionLabel={getOptionLabelPlazas}
                              getOptionSelected={(option, value) =>
                                option.id === value.id
                              }
                              name="establecimiento"
                              label="Solicitudes de Plazas"
                              disabled={props.isReadOnly}
                              required
                              errorobj={errors}                             
                              onInputChange={(e, item) => onChangeSolicitud(e, item)}
                            />
                          </Grid>
                        </Grid>

                        <Grid item xs={6}>
                          <Grid item xs={12} className={classes.field}>
                            <FormInput
                              name="anio"
                              type="number"
                              label="Año"
                              disabled
                              required
                              errorobj={errors}
                            />
                          </Grid>                          
                        <Grid item xs={12} className={classes.field}>
                          <FormDatePicker name="fechaHastaModal" label="Fecha hasta" disabled />
                        </Grid>
                         
                          <Grid item xs={12} className={classes.field}>
                            <FormAutocomplete
                              options={props.tutoresConvenioList}
                              getOptionLabel={getOptionLabelTutores}
                              getOptionSelected={(option, value) =>
                                option.convenio.id === value.convenio.id &&
                                option.tutor.id === value.tutor.id
                              }
                              name="convenioTutor"
                              label="Tutor"
                              disabled={props.isReadOnly}
                              required
                              errorobj={errors}
                            />
                          </Grid>
                          <Grid item xs={12} className={classes.field}>
                            <Typography  align="center"  variant="h8"  color="primary">
                              Es necesario seleccionar una solicitud de plaza para continuar la carga de horario.
                            </Typography> 
                          </Grid>
                        </Grid>
                      </Grid>



                
                <Grid item xs={12}>
                  <Box paddingTop={3}>
                    <FormProvider {...methods2}>
                      <form>
                        <Grid container direction="row">
                          <Grid item xs={4}>
                            <Grid item xs={12} className={classes.field}>
                              <Typography
                                align="left"
                                variant="h6"
                                color="primary"
                              >
                                Nuevo horario de Práctica
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12} className={classes.field}>
                              <FormSelect
                                name="dia"
                                label="Día"
                                disabled={
                                  !hasRole(Roles.ROLE_USER) || props.isReadOnly
                                }
                                options={DIAS_SEMANA2}
                                required
                                //errorobj={errors}
                              />
                            </Grid>
                            <Grid item xs={12} className={classes.field}>
                              <FormInput
                                name="horarioDesde"
                                type="time"
                                label="Horario desde"
                                defaultTime="00:00"
                                value={timeDesde}
                                onChange={changeTimeDesde}
                                disabled={
                                  !hasRole(Roles.ROLE_USER) || props.isReadOnly
                                }
                                required
                                
                              />
                            </Grid>
                            <Grid item xs={12} className={classes.field}>
                              <FormInput
                                name="horarioHasta"
                                type="time"
                                defaultValue="00:00"
                                label="Horario hasta"
                                value={timeHasta}
                                onChange={changeTimeHasta}
                                disabled={
                                  !hasRole(Roles.ROLE_USER) || props.isReadOnly
                                }
                                required
                                
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignContent="flex-end"
                              >
                                {
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={
                                      (!hasRole(Roles.ROLE_USER) || props.isReadOnly) 
                                    }
                                    onClick={handleSubmit2(onSubmit2)}
                                    className={classes.field}
                                  >
                                    Agregar
                                  </Button>
                                }
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={8}>
                            <Grid item xs={12} className={classes.field}>
                              <Typography
                                align="center"
                                variant="h6"
                                color="primary"
                              >
                                Horarios
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table aria-label="Datos estadisticos">
                                  <TableHead>
                                    <TableRow>
                                      
                                      <TableCell align="center">Día</TableCell>
                                      <TableCell align="right">
                                        Horario Desde
                                      </TableCell>
                                      <TableCell align="right">
                                        Horario Hasta
                                      </TableCell>
                                      <TableCell align="center">
                                        Acción
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {horarios
                                      .sort((a, b) =>
                                        a.anio > b.anio ? -1 : 1
                                      )
                                      .map((row, index) => (
                                        <TableRow key={index}>
                                        

                                          <TableCell align="center">
                                            {
                                              DIAS_SEMANA2.find(
                                                (item) => item.id == row.dia
                                              )?.label
                                            }
                                          </TableCell>
                                          <TableCell align="right">
                                            {row.horarioDesde}
                                          </TableCell>
                                          <TableCell align="right">
                                            {row.horarioHasta}
                                          </TableCell>
                                          <TableCell align="center">
                                            <Tooltip
                                              title="Eliminar"
                                              aria-label="eliminar"
                                            >
                                              <IconButton
                                                size="small"
                                                aria-label="eliminar"
                                                color="secondary"
                                                onClick={() =>
                                                  deleteOne(index)
                                                }
                                                disabled={
                                                  !hasRole(Roles.ROLE_USER) || props.isReadOnly
                                                }
                                              >
                                              <DeleteIcon />
                                              </IconButton>
                                            </Tooltip>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Grid>
                        </Grid>
                      </form>
                    </FormProvider>
                  </Box>
                </Grid> 
             








                      <Grid item xs={12}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-end"
                          alignContent="flex-end"
                        >
                          <Button
                            variant="contained"
                            color="default"
                            size="large"
                            onClick={handleClose}
                            className={classes.field}
                          >
                            Cancelar
                          </Button>
                          {
                            <Button
                              variant="contained"
                              color="primary"
                              size="large"
                              disabled={
                                !hasRole(Roles.ROLE_USER) || props.isReadOnly
                              }
                              onClick={handleSubmit(onSubmit)}
                              className={classes.field}
                            >
                              Guardar
                            </Button>
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
              <DeleteDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onAccept={deleteOne}
            aria-labelledby="form-dialog-title"
          />
            </Grid>
          </Grid>
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
        </Box>
      </Dialog>
    </>
  );
}