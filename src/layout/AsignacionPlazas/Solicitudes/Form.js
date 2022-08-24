import React, { useState, useEffect } from "react";
import { Button, Grid, Box, Modal,Backdrop, CircularProgress,LinearProgress, TextareaAutosize } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "api/DnerhsApi";
import "react-toastify/dist/ReactToastify.css";
import FormInput from "Controls/Input";
import FormSelect from "Controls/Select";
import { useParams, useLocation } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import Alert from "components/Alert";
import history from "utils/History";
import useAuth from "hooks/Auth";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import { getAllEstablecimientos } from "services/InstitucionService";
import FormAutocomplete from "Controls/Autocomplete";
import { getCarrerasProgramas, getEstudiante } from "services/ConvenioService";
import Roles from "constants/Roles";
import DeleteDialog from "../../../dialogs/DeleteDialog";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Warning from "@material-ui/icons/Warning";
import { trackPromise } from 'react-promise-tracker';

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
  descripcion: yup.string().required("El campo descripción es requerido"),
});

const URL_BASE_CARRERAS = "/carreras-programas/";
let regionId= "";
let establecimientoDatoId="";
let carreraProgramaId="";
let convenioPut=0;
let nombreCarrera="";
let nombreEstab="";
let nombreReg="";
const Form = () => {
  const classes = useStyles();
  const [timeDesde, setTimeDesde] = useState("00:00");
  const [timeHasta, setTimeHasta] = useState("00:00");
  const [sent, setSent] = useState(false);
  const [carreraResponse, setCarreraResponse] = useState();
  const [estadoPendiente, setIsUpdateP] = useState(false);
  const [estadoRechazado, setIsUpdateR] = useState(false);
  const [estadoAprobado, setIsUpdateA] = useState(false);
  const [observacion, setRechazoObservacion] = useState();
  const [convenio, setConvenio] = useState(0);
  const [verHistorial, setIsUpdateH] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { carreraId, convenioId } = useParams();
  const params = useParams();
  const methods = useForm({ resolver: yupResolver() });
  const { handleSubmit, errors, setValue } = methods;
  const [horarios, setHorarios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [horarios2, setHorarios2] = useState([
    {
      establecimiento: "Establecimiento 1",
      dia: "Lunes",
      horarioDesde: "10:00",
      horarioHasta: "11:00",
    },
    {
      establecimiento: "Establecimiento 2",
      dia: "Martes",
      horarioDesde: "12:00",
      horarioHasta: "13:00",
    },
    {
      establecimiento: "Establecimiento 3",
      dia: "Miercoles",
      horarioDesde: "14:00",
      horarioHasta: "18:00",
    },
    {
      establecimiento: "Establecimiento 4",
      dia: "Jueves",
      horarioDesde: "7:00",
      horarioHasta: "8:00",
    },
    {
      establecimiento: "Establecimiento 5",
      dia: "Viernes",
      horarioDesde: "9:00",
      horarioHasta: "10:00",
    },
  ]);
  const [establecimientosList, setEstablecimientosList] = useState([]);
  const [carrerasOptions, setCarrerasOptions] = useState([]);
  const [regionesOptions, setRegionesOptions] = useState([]);  
  const [establecimientosOptions, setEstablecimientosOptions] = useState([]);
  const { hasRole } = useAuth();
  const { state } = useLocation();
  const [annio, setannio] = useState();
  const [pSolicitadas, setpSolicitadas] = useState();
  const [toDelete, setToDelete] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const anhios = ["1","2","3","4","5","6"];

  const symbolsArr = ["e", "E", "+", "-", "."];
    const [plazasSolicitadas, setPlazasSolicitadas] = useState(0);

 
  const methods2 = useForm({
    shouldUnregister: false,
    //  resolver: yupResolver(validationSchema),
  });

  const {  handleSubmit: handleSubmit2,   errors: errors2,  reset: reset2, setValue:getValues2 } = methods2;

  useEffect(() => {

    //setIsUpdate(!state?.readOnly);
    
    if (convenioId &&  state?.readOnly) {     
      setIsReadOnly(state?.readOnly);
      setValuesForEdit();
      getServerData();
    }else{
      setIsAddMode(true);
      getServerData();
    }
    const formValuesHorarios = {
      horarioDesde: "00:00",
      horarioHasta: "00:00"          
    };        
    Object.keys(formValuesHorarios).forEach((field) => {          
      getValues2(field, formValuesHorarios[field]);        
    });
    reset2();
   
  }, []);
  const changeTimeDesde = (e) => {
    setTimeDesde(e.target.value)
  }
  const changeTimeHasta = (e) => {
    setTimeHasta(e.target.value)
  }
  const getServerData = async () => {
    try {
      let { data } = await getAllEstablecimientos();
      const { data: responseCarreraProgramaData } = await getCarrerasProgramas(convenioPut!=0?convenioPut:convenioId);
      const {data : responseRegiones} = await DnerhsApi.get(
        `regiones`
      );
      const {data : responseAsignaciones} = await DnerhsApi.get(
        `solicitudes-plazas-asignaciones/${params.convenioId}/asignaciones`
      );
      setRegionesOptions(responseRegiones);
      setEstablecimientosList(data);
      setCarrerasOptions(responseCarreraProgramaData);
      setHorarios(responseAsignaciones);
      reset2();
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };

  const setValuesForEdit = async () => {
    try {
      //
      const { data: solicitudResponseData } = await DnerhsApi.get(`/solicitudes-plazas/${params.convenioId}`
      );
     
      setCarreraResponse(solicitudResponseData);  
      convenioPut=solicitudResponseData.convenio.id;
      setConvenio(solicitudResponseData.convenio.id);    
      reset2();
      if(solicitudResponseData?.estado==='Pendiente'){
        setIsUpdateP(true);
      }
      let banderita=hasRole(Roles.ROLE_DNERHS);
      if(solicitudResponseData?.estado==='Rechazado por DNERHS' && !banderita){
        setIsUpdateR(true);
      }
      //if(solicitudResponseData?.estado==='Rechazado por DNERHS'){ }
        
        const { data: historialResponseData } = await DnerhsApi.get(`/solicitudes-plazas-observaciones/${params.convenioId}/observaciones`
        );
        if(historialResponseData.length>0){
          
          setHistorial(historialResponseData);
          setIsUpdateH(true);
          reset2();
        }
        
     
      if(solicitudResponseData?.estado==='Aprobado por DNERHS'){
        setIsUpdateA(true);
      }
      const formValues = {
        carreraPrograma: solicitudResponseData?.carreraprograma,
          regionesSanitarias:solicitudResponseData?.datosEstablecimiento.regionSanitaria,
          establecimientos: solicitudResponseData?.datosEstablecimiento.institucionEstablecimiento,
        anhio:solicitudResponseData?.anio.toString(),
        plazasSolicitadas: solicitudResponseData?.lugaresSolicitados
        
      };
      establecimientoDatoId=solicitudResponseData?.datosEstablecimiento?.institucionEstablecimiento?.nombreServicio?.nombre;
      //plazasSolicitadas=carreraResponseData?.lugaresSolicitados;

      Object.keys(formValues).forEach((field) => {
          if(field==='plazasSolicitadas'){
          setPlazasSolicitadas(formValues[field]);
          setpSolicitadas(formValues[field]);

        }
        setValue(field, formValues[field]);
      
      });
      reset2();
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };
  const handleRegionChange = (e,value) => {
    regionId=(value.trim()).substring(0, value.indexOf("-"));
    obtenerEstablecimientos(regionId);
    nombreReg= (value.trim()).substring(value.indexOf("-") + 1);
  };
  const handleEstablecimientoChange = (e,value) => {
    establecimientoDatoId= (value.trim()).substring(0, value.indexOf("-"));
    nombreEstab= (value.trim()).substring(value.indexOf("-") + 1);
  };
  const handleCarreraChange = (e,value) => {
    carreraProgramaId=(value.trim()).substring(0, value.indexOf("-"));
     nombreCarrera= ((value.trim()).substring(value.indexOf("-") + 1)).trim();
  };
  const handlePlazasSolicitadasChange = (event) => {
       setPlazasSolicitadas(event.target.value);
       setpSolicitadas(event.target.value);
       setValue('plazasSolicitadas', event.target.value);
       event.preventDefault();
  };

  const handleAnhioChange = (e, value) => {
    setannio(value);
  };
  
  const obtenerEstablecimientos= async (value) => {
    try {
        const { data : responseEstablecimientosPorRegion } = await DnerhsApi.get(
        `instituciones/establecimientos/region_sanitaria/${value}`
      );
      setEstablecimientosOptions(responseEstablecimientosPorRegion);   
      if(responseEstablecimientosPorRegion.length===0){
        const formValues = {
            establecimientos: {id:'', nombreServicio:{id: '', nombre:''}}          
        };
        Object.keys(formValues).forEach((field) => {
          setValue(field, formValues[field]);
        });
      }
      getestablecimientosOptions();
      reset2();
    
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    }
  };
  const onSubmit = async (data) => {   
        if(typeof(establecimientoDatoId)=== 'undefined' || establecimientoDatoId==='' || establecimientoDatoId===null || establecimientoDatoId==='-'){
          Alert.show({ message: "Debe ingresar datos existentes", type: "error" });
        }else if(typeof(carreraProgramaId)=== 'undefined' || carreraProgramaId==='' || carreraProgramaId===null || carreraProgramaId==='-'){
          Alert.show({ message: "Debe ingresar datos existentes", type: "error" });
        }else if(typeof(regionId)=== 'undefined' || regionId==='' || regionId===null || regionId==='-'){
          Alert.show({ message: "Debe ingresar datos existentes", type: "error" });
        }else{
       /* const  responseValidacion = await DnerhsApi.get(
        `/establecimientos-carreras-plazas/${establecimientoDatoId.trim()}/carreras`
        );
        if(responseValidacion.data.length==0){
          Alert.show({ message: "No existen plazas creadas para este establecimiento", type: "error" });

        }
        for (let y in responseValidacion.data) {  
          if(responseValidacion.data[y].carreraprograma.id.toString() ===carreraProgramaId.trim()){
            if(parseInt(pSolicitadas.toString().trim()) > responseValidacion.data[y].disponible ){
              Alert.show({ message: "La cantidad excede el número de plazas disponibles", type: "error" });

            }else{*/
              let message = "";
              let url = "/solicitudes-plazas";
          
               let payload = {
                datosEstablecimiento:{ id: establecimientoDatoId},
                carreraprograma: {id: carreraProgramaId, descripcion:nombreCarrera},
                anio: annio,
                lugaresSolicitados: pSolicitadas,
                estado: "Pendiente",
                convenio: {id: convenioId}
              };           
              try {
                
                if(estadoRechazado){
                  let payloadPut= carreraResponse;
                  payloadPut.anio=annio;
                  payloadPut.datosEstablecimiento.institucionEstablecimiento.nombreServicio.id=establecimientoDatoId;
                  payloadPut.datosEstablecimiento.regionSanitaria.region=nombreReg;
                  payloadPut.datosEstablecimiento.regionSanitaria.id=regionId;
                  payloadPut.datosEstablecimiento.institucionEstablecimiento.nombreServicio.nombre=nombreEstab;
                  payloadPut.carreraprograma.id=carreraProgramaId;
                  payloadPut.carreraprograma.descripcion=nombreCarrera;
                  payloadPut.lugaresSolicitados=pSolicitadas;
                  payloadPut.estado="Pendiente";
                  /* payload = {
                    id:  carreraResponse, 
                    datosEstablecimiento:{ id: establecimientoDatoId  },
                    carreraprograma: {id: carreraProgramaId},
                    anio: annio,
                    lugaresSolicitados: pSolicitadas,
                    estado: "Pendiente",
                    convenio: {id: convenio}
                  }; */
                  await trackPromise(DnerhsApi.put(url, {
                    ...payloadPut,
                  }));
                  setSent(true);
                  message = "Datos guardados exitosamente.";

                }else{
                  await trackPromise(DnerhsApi.post(url, {
                    ...payload,
                  }));
                  setSent(true);
                  
                  message = "Datos guardados exitosamente.";
                }                
                Alert.show({
                  message,
                  type: "success",
                });                
                history.goBack();
                                               
              } catch (error) {
                console.log("error catch");
                if(error.response.data && error.response.data.status===400){
                  //Alert.showServerError(error.response.data.message);
                  Alert.show({ message: error.response.data.message, type: "error" });        
                }else{
                  Alert.showServerError(error.message);
                }
              }
            //}
            //break;
          //}
        //}
      }  
  };
  
  const getestablecimientosOptions = (establecimiento) => {
    if(typeof(establecimiento?.nombreServicio?.nombre)!= 'undefined'){
      return  `${establecimiento?.nombreServicio?.id} - ${establecimiento?.nombreServicio?.nombre}`; 
    }else{
      return  `${establecimiento?.institucionEstablecimiento?.nombreServicio?.id} - ${establecimiento?.institucionEstablecimiento?.nombreServicio?.nombre}`;
    }
  }
  const getcarrerasOptions = (carrera) => {
    if(typeof(carrera?.descripcion)!= 'undefined'){
      return  `${carrera?.id} - ${carrera?.descripcion}`;
    }else{
      return  `${carrera?.carreraPrograma?.id} - ${carrera?.carreraPrograma?.descripcion}`;
    }
  }
  const getOptionLabelEstablecimientos = (establecimiento) => {
    return `${establecimiento?.nombreServicio?.nombre}`;
  };

  const onSubmit2 = async (data) => {
    //setHorarios([...horarios, data]);
    //reset2();
    if(timeDesde==="00:00" && timeHasta==="00:00" ){
      Alert.show({
        message : "Verifique el  horario de practica",
        type : "warning"
      })
    }else{
      let url = "/solicitudes-plazas-asignaciones";
      const payload = {
        dia: data.dia,
        solicitudPlaza:{id:convenioId},
        horarioDesde: timeDesde + ':00',
        horarioHasta: timeHasta     + ':00', 
      };

      try {
        let message = "";         
          let result= await DnerhsApi.post(url, {
            ...payload,
          });
          let resultado=  {
            id:result.data.id,
            establecimiento: establecimientoDatoId,
            dia: result.data.dia,
            horarioDesde: result.data.horarioDesde,
            horarioHasta: result.data.horarioHasta,
          };
          setHorarios([...horarios, resultado]);
        setTimeDesde("00:00");
        setTimeHasta("00:00");
          reset2();
          message = "Datos guardados exitosamente.";
        Alert.show({
          message,
          type: "success"
        })
      
      
      } catch (error) {
        console.log(error);
        if (error.response) {
          Alert.showServerError(error);
        } else {
          Alert.showServerError(error);
        }
      }
    }
  };
  const handleOpenDialog = (id) => {
    setOpenDialog(true);
    setToDelete(id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteOne = async () => {
    try {
      let message = ""; 
      let url = `/solicitudes-plazas-asignaciones/${toDelete}`;
      const response = await DnerhsApi.delete(url);
      console.log("response delete", response);
      message = `Registro con id ${toDelete} eliminado correctamente`;
      Alert.show({
        message,
        type: "success"
      });
      getServerData();
    } catch (error) {
      console.log(error);
    }
    setOpenDialog(false);
    setToDelete();
  };
  const aprobar = async (data) => {
    
    let url = `solicitudes-plazas/${params.convenioId}/aprobar`;
    try {
      let message = "";         
        await trackPromise(DnerhsApi.put(url));
        setSent(true)
        message = "Solicitud Aprobada exitosamente.";
      Alert.show({
        message,
        type: "success"
      })
      history.goBack();
      
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      } else {
        Alert.showServerError(error);
      }
    }
  };
  const rechazar = async (data) => {
    abrirCerrarModal();  
    let url = `solicitudes-plazas/${params.convenioId}/rechazar?observacion=${observacion}`;
    try {
      let message = "";
      //const observacion =  rechazoObservacion;         
        await trackPromise(DnerhsApi.put(url, ));
        setSent(true)
        message = "Solcitud Rechazada Exitosamente.";
      Alert.show({
        message,
        type: "success"
      })
      
      history.goBack();
      
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      } else {
        Alert.showServerError(error);
      }
    }
  };
  /*MODAL*/
const [modal, setModal]=useState(false);
const abrirCerrarModal =()=>{
  //if(typeof(key) != 'undefined'){
    //carrera=radioFields[key].label;
    //carreraKey=key;
    
  //}
  setModal(!modal);
  
}
  const cerrarModal =()=>{
  /*if(carreraDisabled === 'no'){
    handleRadioChange(carreraKey, 'si');
    handleCantidadChange(carreraKey, carreraCantidad);
    carreraDisabled='si';
  }*/
  setModal(!modal);
  
}
const handleObservacionChange = ( value) => {
  //rechazoObservacion=value;
  setRechazoObservacion(value);
};
//  <Box sx={classes.box}>
const bodyModal= (
  
  <div className={classes.modal} align="center" classes={{focused: classes.outlinedInputFocused}} 
  style={{fontSize: 0.875+'rem', fontFamily: 'Roboto', fontWeight: 400,
  lineHeight: 1.43,
  letterSpacing: 0.01071+'em'
}} >
      <Card >
      <CardContent>
        <div>
        <Typography align="center" variant="h5" color="primary">
        Observación para Rechazar Solicitud
            </Typography>
    
            <br/> <br/>

        </div>
     
        <TextareaAutosize aria-label="Observacion"  rows={6} rowsMax={10} placeholder="Observaciones" onChange={(e) =>
                                handleObservacionChange(e.target.value)}  style={{width: 600, fontSize: 0.875+'rem', fontFamily: 'Roboto', fontWeight: 400,
                                lineHeight: 1.43,
                                letterSpacing: 0.01071+'em', borderRadius: 10+'px',
                                focus:{
                                  outline: 'none'
                              },outline: 'none'}}/>
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
              onClick={()=>rechazar()} 
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </div>
  
)
const [open, setOpen] = React.useState(false);
const handleClose = () => {
  setOpen(false);
};
const handleToggle = () => {
  setOpen(!open);
};
  return (
    <div>
      <Grid item xs={12}>
        <Typography align="center" variant="h5" color="primary">
          Solicitud de plazas
        </Typography>
      </Grid>
      <div>
        <FormProvider {...methods}>
          <form>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
            >

              <Grid item xs={8} className={classes.form}>
                <Grid item xs={12} className={classes.field}>
                  <FormAutocomplete
                    options={carrerasOptions}
                    getOptionLabel={getcarrerasOptions}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    name="carreraPrograma"
                    label="Seleccione una carrera"
                    onInputChange={(e, item) => handleCarreraChange(e,item)}
                    required
                    disabled={(state?.readOnly && !estadoRechazado)}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormAutocomplete 
                    options={regionesOptions}
                    getOptionLabel={(item) => item.id+" - "+item.region}
                    getOptionValue={(item) => item.id}
                    getOptionSelected={(option, value) =>
                      option.id === value.id                      
                    }
                    name="regionesSanitarias"
                    label="Seleccione la región"
                    onInputChange={(e, item) => handleRegionChange(e,item)}
                    required
                    disabled={(state?.readOnly && !estadoRechazado)}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormAutocomplete
                    options={establecimientosOptions}
                    getOptionLabel={getestablecimientosOptions}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    name="establecimientos"
                    label="Seleccione una establecimiento"
                    onInputChange={(e, item) => handleEstablecimientoChange(e,item)}
                    required
                    disabled={(state?.readOnly && !estadoRechazado)}
                  />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                  <FormAutocomplete
                    options={anhios}
                    getOptionLabel={(item) => item}
                    getOptionSelected={(option, value) =>
                      option === value
                    }
                    name="anhio"
                    label="Seleccione el Año"
                    onInputChange={(e, item) => handleAnhioChange(e, item)}
                    required
                    disabled={(state?.readOnly && !estadoRechazado)}
                  />
                </Grid>
                
                <Grid item xs={12} className={classes.field}>
                  <FormInput
                    type="number"
                    name="plazasSolicitadas"
                    label="Lugares solicitados"
                    value={plazasSolicitadas}
                    InputProps={{
                      inputProps: { 
                         min: 1 
                    }
                    }}
                    /*onKeyDown={(event) =>
                      handlePlazasSolicitadasChange(event)
                    }*/
                   // onClick={(event) => handlePlazasSolicitadasChange(event)}
                    //onInputChange={(e) => handlePlazasSolicitadasChange(e.target.value)}
                   // onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()  && handlePlazasSolicitadasChange(e.target.value)}
                    onChange={(event) => handlePlazasSolicitadasChange(event)}
                    required
                    disabled={(state?.readOnly && !estadoRechazado)}
                  />
                </Grid>
                
                {((!isAddMode && !estadoPendiente && !estadoRechazado && !hasRole(Roles.ROLE_DNERHS)) || estadoAprobado ) && (
                  <Grid item xs={12}>
                    <Grid item xs={12} className={classes.field}>
                      <Typography align="center" variant="h6" color="primary">
                        Asignaciones
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <Table aria-label="Datos estadisticos">
                          <TableHead>
                            <TableRow>
                              
                              <TableCell align="center">Día</TableCell>
                              <TableCell align="right">Horario Desde</TableCell>
                              <TableCell align="right">Horario Hasta</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {horarios
                              .sort((a, b) => (a.anio > b.anio ? -1 : 1))
                              .map((row, index) => (
                                <TableRow key={index}>
                               

                                  <TableCell align="center">
                                    {row.dia==="1"?"lunes":(row.dia==="2"?"martes":(row.dia==="3"?"miercoles":(row.dia==="4"?"jueves":(row.dia==="5"?"viernes":(row.dia==="6"?"sabado":(row.dia==="7"?"domingo":""))))))}
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
                  </Grid>
                )}
                {(verHistorial) && (
                  <Grid item xs={12}>
                    <Grid item xs={12} className={classes.field}>
                      <Typography align="center" variant="h6" color="primary">
                        Historial de Observaciones
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <Table aria-label="Datos estadisticos">
                          <TableHead>
                            <TableRow>                              
                              <TableCell align="left">Fecha Observación</TableCell>
                              <TableCell align="left">Observación</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {historial.map((row, index) => (
                                <TableRow key={index}>                          

                                 
                                  <TableCell align="left">
                                    {row.fechaCreacion}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.observacion}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                )}
              </Grid>
          
              {(hasRole(Roles.ROLE_DNERHS) && estadoPendiente) && (
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
                                Nueva asignación
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12} className={classes.field}>
                              <FormSelect
                                name="dia"
                                label="Día"
                                disabled={false}
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
                                disabled={false}
                                required
                                defaultTime="00:00"
                                value={timeDesde}
                                onChange={changeTimeDesde}

                                // errorobj={errors}
                              />
                            </Grid>
                            <Grid item xs={12} className={classes.field}>
                              <FormInput
                                name="horarioHasta"
                                type="time"
                                label="Horario desde"
                                disabled={false}
                                required
                                defaultValue="00:00"
                                value={timeHasta}
                                onChange={changeTimeHasta}
                                // errorobj={errors}
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
                                    disabled={false}
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
                                Asignaciones
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
                                                  handleOpenDialog(row.id)
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
              )}
              <Grid
                item
                xs={hasRole(Roles.ROLE_DNERHS) ? 12 : 8}
                className={classes.field}
              >
                <Grid
                  item
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item className={classes.field}>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={() => history.goBack()}
                    >
                      Atrás
                    </Button>
                  </Grid>
                  {((!hasRole(Roles.ROLE_DNERHS)  && isAddMode) || estadoRechazado ) && (
                    <Grid item className={classes.field}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={onSubmit} 
                      >
                        Guardar
                      </Button>
                    </Grid>
                  )}
                  {( hasRole(Roles.ROLE_DNERHS) && estadoPendiente) && 
                    <Grid item className={classes.field}>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => abrirCerrarModal()}
                      >
                        Rechazar
                      </Button>
                    </Grid>
                  }
                  {( hasRole(Roles.ROLE_DNERHS) && estadoPendiente) &&
                    <Grid item className={classes.field}>
                      <Button
                        color="primary"
                        variant="contained"
                        //onClick={onSubmit} de Guardar

                      onClick={() => aprobar()}
                      >
                        Aprobar
                      </Button>
                    </Grid>
                  }
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
      </div>
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
    </div>
  );
};

export default Form;
