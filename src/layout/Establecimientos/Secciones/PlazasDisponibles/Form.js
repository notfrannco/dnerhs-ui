import React, { useEffect, useState } from "react";
import {
FormControlLabel,
Grid,
Radio,
RadioGroup,
Switch,
SwitchProps,
FormLabel,
TextField,
TextareaAutosize,
Modal,
Button,Backdrop, CircularProgress,LinearProgress
  
} from "@material-ui/core";
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../../api/DnerhsApi";
import { useParams, useLocation } from "react-router-dom";
import Alert from "../../../../components/Alert";
import ResponseUtils from "../../../../utils/ResponseUtils";
import history from "../../../../utils/History";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormInput from "../../../../Controls/Input";
import { StylesContext } from "@material-ui/styles";
import { trackPromise } from 'react-promise-tracker';

// style="width:70px"   .MuiFormControl-root{width:50px;}
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
textField:{
  width: '100%'
},

backdrop: { zIndex: theme.zIndex.drawer + 1, color: '#fff', },
outlinedInputFocused: {
  borderStyle: 'none',
  borderColor: 'red',
  outlineWidth: 0,
  outline: 'none',
  backgroundColor: 'green'
},
}));
const mapCarreras = new Map();
let carrera="";
let carreraKey="";
let carreraDisabled="";
let carreraCantidad="";
let carreraObservacion="";
/*const initialValuesRadioFields = {
medicinaAlumnosInternos: {
  label: "Medicina - Alumnos internos",
  cantidad: "0",
  valor: "no",
},
medicianAlumnosAniosInferiores: {
  label: "Medicina - Alumnos de años inferiores por rotación",
  cantidad: "0",
  valor: "no",
},
enfermeria: {
  label: "Enfermería",
  cantidad: "0",
  valor: "no",
},
obstetricia: {
  label: "Obstetricia",
  cantidad: "0",
  valor: "no",
},
odontologia: {
  label: "Ondotología",
  cantidad: "0",
  valor: "no",
},
kinesiologia: {
  label: "Kinesiología",
  cantidad: "0",
  valor: "no",
},
nutricion: {
  label: "Nutrición",
  cantidad: "0",
  valor: "no",
},
psicologia: {
  label: "Psicología",
  cantidad: "0",
  valor: "no",
},
fisioterapia: {
  label: "Fisioterapia",
  cantidad: "0",
  valor: "no",
},
radiologia: {
  label: "Radiología",
  cantidad: "0",
  valor: "no",
},
bioquimica: {
  label: "Bioquímica",
  cantidad: "0",
  valor: "no",
},
farmacia: {
  label: "Farmacia",
  cantidad: "0",
  valor: "no",
},
instrumentacion: {
  label: "Instrumentación",
  cantidad: "0",
  valor: "no",
}
}
*/
const Form = () => {
const classes = useStyles();
const [radioFields, setRadioFields] = useState([]);
const [isReadOnly, setIsReadOnly] = useState(false);
const params = useParams();
const methods = useForm({});
const { handleSubmit } = methods;
const [isUpdate, setIsUpdate] = useState(false);
const [plazasDisponiblesResponseData, setPlazasDisponiblesResponseData] = useState({});
let location = useLocation();
const auxiliarList=[];
const [verHistorial, setIsUpdateH] = useState(false);
const [historial, setHistorial] = useState([]);
const [sent, setSent] = useState(false);

useEffect(() => {
  const load = () => {
    try {
      getServerData();
      getPlazas();
      setIsReadOnly(location?.state?.readOnly);
    } catch (error) {
      console.log(error);
    }
  };

  load();
}, []);

const getServerData = async () => {
  try {
   
    const responseCarreras = await trackPromise(DnerhsApi.get("/carreras-programas"));
    setSent(true)
    for (let x in responseCarreras.data) {
      
      if(responseCarreras.data[x].descripcion=='Medicina'){
        auxiliarList.push({"id":responseCarreras.data[x].descripcion,"descripcion":"Medicina - Alumnos Internos", "label": x.descripcion,
        "cantidad": "0",
        "valor": "no",
        "disponible":"0", 
        "engestion":"0",
        "ocupadas":"0",
        "medicinaAnosInferiores":"0",
        "observaciones":"0"});
        auxiliarList.push({"id":"0","descripcion":"Medicina - Alumnos de años Inferiores por Rotación", "label": x.descripcion,
        "cantidad": "0",
        "valor": "no",
        "disponible":"0", 
        "engestion":"0",
        "ocupadas":"0",
        "medicinaAnosInferiores":"0",
        "observaciones":"0"});
      }else{
        auxiliarList.push({"id":responseCarreras.data[x].descripcion,"descripcion":responseCarreras.data[x].descripcion, "label": x.descripcion,
        "cantidad": "0",
        "valor": "no",
        "disponible":"0", 
        "engestion":"0",
        "ocupadas":"0",
        "medicinaAnosInferiores":"0",
        "observaciones":"0"});
      }      
    }
    setRadioFields(
      auxiliarList.map((x) => (
        {
          label: x.descripcion,
          id: x.descripcion,
          cantidad: "0",
          valor: "no",
          disponible:"0", 
          engestion:"0",
          ocupadas:"0",
          observaciones:"0"
        }
      
      ))
    );
    const { data: historialResponseData } = await DnerhsApi.get(`/establecimientos-carreras-plazas-observaciones/establecimiento/${params.establecimientoId}/observaciones`
      );
      if(historialResponseData.length>0){
        
        setHistorial(historialResponseData);
        setIsUpdateH(true);
        //reset2();
      }
  } catch (error) {
    console.log(error);
    showMessageError(error);
  }
};
const getPlazas = async () => {
  try {
    
    const responsePlazasDisponibles = await DnerhsApi.get(
        `/establecimientos-carreras-plazas/${params.establecimientoId}/carreras`
    );

    if (responsePlazasDisponibles.data) {
    //let { data } = responsePlazasDisponibles.data;
    let valCantAnhInf="0";
      for (let x in responsePlazasDisponibles.data) {
        for (let y in auxiliarList) {            
          if (responsePlazasDisponibles.data[x].carreraprograma.descripcion.trim()===String(auxiliarList[y].id).trim()) {
            let valorDisponible="0";              
            let valorCantidad="0";
            let valCantDisp="0";
            let valCantGest="0";
            let valCantOcup="0";
            
            let valorId="0";
            
            valorId=responsePlazasDisponibles.data[x].id;
            if (responsePlazasDisponibles.data[x].cantidad>0) {
              valorDisponible = "si";
            } else {
              valorDisponible = "no";
            }
            valorCantidad=String(responsePlazasDisponibles.data[x].cantidad);
            valCantDisp=String(responsePlazasDisponibles.data[x].disponible);
            valCantGest=String(responsePlazasDisponibles.data[x].enGestion===null?"0":responsePlazasDisponibles.data[x].enGestion);
            valCantOcup=String(responsePlazasDisponibles.data[x].ocupadas);
            if (responsePlazasDisponibles.data[x].carreraprograma.descripcion.trim()==="Medicina"){
              valCantAnhInf=String(responsePlazasDisponibles.data[x].medicinaAnosInferiores);
            }

            auxiliarList[y].id=valorId;
            auxiliarList[y].valor=valorDisponible;
            auxiliarList[y].cantidad=valorCantidad;
            auxiliarList[y].disponible=valCantDisp;
            auxiliarList[y].engestion=valCantGest;
            auxiliarList[y].ocupadas=valCantOcup;
            auxiliarList[y].medicinaAnosInferiores=valCantAnhInf;
            break;
          }
        }
      }
      if( String(auxiliarList[1].id)==="0") {
        if (valCantAnhInf>0) {
          auxiliarList[1].valor= "si";
          auxiliarList[1].cantidad=valCantAnhInf;
          auxiliarList[1].disponible="0";
          auxiliarList[1].engestion="0";
          auxiliarList[1].ocupadas="0";
          auxiliarList[1].medicinaAnosInferiores="0"; 
        } else {            
        auxiliarList[1].valor= "no";
        auxiliarList[1].cantidad=valCantAnhInf;
        auxiliarList[1].disponible="0";
        auxiliarList[1].engestion="0";
        auxiliarList[1].ocupadas="0";
        auxiliarList[1].medicinaAnosInferiores="0"; 
        }
        
      }
      setRadioFields(
        auxiliarList.map((u) => (
          {
            label: u.descripcion,
            id:u.id,
            cantidad: u.cantidad,
            valor: u.valor,
            disponible: u.disponible, 
            engestion:u.engestion,
            ocupadas:u.ocupadas
          }          
        ))
      );
    }
   
      setPlazasDisponiblesResponseData(radioFields);
      setIsUpdate(true);
  } catch (error) {
    console.log(error);
    showMessageError(error);
  }
};

const onSubmit = async (data) => {    
  abrirCerrarModal();    
  let vlr=radioFields[carreraKey].valor=='si'?true:false;
  let fields = {
      cantidad:radioFields[carreraKey].cantidad ,
      observacion:carreraObservacion     
  };  
  /*
   let fields = {
      carreraprogramaDisponible: vlr,
      cantidad:radioFields[carreraKey].cantidad ,
      observacion:carreraObservacion     
  };  */
  try {
    let url = "/establecimientos-carreras-plazas/";
    let idd=radioFields[carreraKey].id;
    let message;
    let resultado="";    
      await DnerhsApi.put(url+`${idd}/cantidad?cantidad=${(fields.cantidad).toString()}&observacion=${fields.observacion}`
      //, {        ...fields      }
      ).then(res => {
        resultado=res;
        console.log(res);
        console.log(res.data);
        setTimeout(function(){
          getServerData();
          getPlazas();
      }, 1000);
      })
      message = "Datos actualizados exitosamente.";
    
    Alert.show({
      message,
      type: "success"
    });
    
    
  } catch (error) {
    console.log(error);
    showMessageError(error);
  }
};

const showMessageError = (error) => {
  let message = "Ocurrió un error inesperado, por favor vuelva a reintentar";
  if (error.response) {
    message = ResponseUtils.getMessageError(error.response);
  }

  Alert.show({
    message,
    type: "error"
  })
}

const handleRadioChange = (key, value) => {
  setRadioFields((prevState) => {
    let newState = { ...prevState };
    let newValue = newState[key]["valor"] = value;
    if (newValue === 'no') {
      carreraCantidad=radioFields[key].cantidad;
      newState[key]["cantidad"] = "0";
      carreraDisabled='no';
      carreraKey=key;
      abrirCerrarModal(key);
    }else{
      carreraDisabled='si';
    }
    return newState;
  });
};

const handleCantidadChange = (key, value) => {
  setRadioFields((prevState) => {
    let newState = { ...prevState };
    newState[key]["cantidad"] = parseInt(value);
    return newState;
  });
};

const handleObservacionChange = ( value) => {
  carreraObservacion=value;
};
/*MODAL*/
const [modal, setModal]=useState(false);
const abrirCerrarModal =(key)=>{
  if(typeof(key) != 'undefined'){
    carrera=radioFields[key].label;
    carreraKey=key;
    
  }
  setModal(!modal);
  
}
  const cerrarModal =()=>{
  if(carreraDisabled === 'no'){
    handleRadioChange(carreraKey, 'si');
    handleCantidadChange(carreraKey, carreraCantidad);
    carreraDisabled='si';
  }
  setModal(!modal);
  
}
const handleKeyDown = (event, key, value) => {
  if (event.key === 'Enter') {
    
    abrirCerrarModal(key);
  }
}
//  <Box sx={classes.box}>
const bodyModal= (
  
  <div className={classes.modal} align="center" classes={{focused: classes.outlinedInputFocused}}>
      <Card>
      <CardContent>
        <div>
        <Typography align="center" variant="h5" color="primary">
        {carrera}
            </Typography>
    
            <br/> 
            <FormLabel align="left">Observaciones</FormLabel>

        </div>
        <br/> <br/>
        <TextareaAutosize aria-label="Observacion"  rows={6} rowsMax={10}  placeholder="&nbsp;&nbsp;Ingrese una observación" onChange={(e) =>
                                handleObservacionChange(e.target.value)}
                                style={{width: 600, fontSize: 0.875+'rem', fontFamily: 'Roboto', fontWeight: 400,
                                lineHeight: 1.43, letterSpacing: 0.01071+'em', borderRadius: 10+'px', 
                                focus:{
                                  outline: 'none'
                              },outline: 'none'
                              }}
                                />
        <br/> <br/>
        <Grid container direction="row" justifyContent="flex-end" alignItems="center">
      
          <Grid item className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)} 
            >
              Guardar
            </Button>
          </Grid>
          <Grid item className={classes.field}>
            <Button
              variant="contained"
              color="default"
              onClick={()=>cerrarModal()}>Cancelar
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
    <Backdrop className={classes.backdrop}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
      
      </Backdrop>
      <Grid item xs={12}>
      <br/>
        <Typography align="center" variant="h5" color="primary">
          Plazas Disponibles
        </Typography>
        <br/>
      </Grid>
      <div>
        
        <FormProvider {...methods}>
          <Grid container direction="row" spacing={5}>
            {Object.keys(radioFields).map((key) => {
              let field = radioFields[key];
              return (
                <Grid key={key} item md={4} xs={12}>
                  <Card>
                    <CardContent>
                      <Grid container direction="row" >
                        <Grid item xs={12} className={classes.field} style={{paddingBottom: field.label==="Medicina - Alumnos de años Inferiores por Rotación" ?'68px':'unset' }} >
                          <FormLabel >{field.label}</FormLabel>
                          <RadioGroup style={{ display: field.label!=="Medicina - Alumnos de años Inferiores por Rotación" ? 'block' : 'none' }}
                            
                            label={field.label}
                            value={field.valor}
                            onChange={(e) =>
                              handleRadioChange(key, e.target.value)
                            }
                            name="radio-button-group"
                          >
                            <Grid item xs={12}>
                            <FormControlLabel
                              value="si"
                              control={<Radio />}
                              label="Si"
                              disabled={isReadOnly}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label="No"
                              disabled={isReadOnly}
                            />
                            </Grid>
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={12} className={classes.field} style={{paddingBottom: field.label==="Medicina - Alumnos de años Inferiores por Rotación" ?'68px':'unset' }} >
                            <TextField  
                              name={field.key}
                              label="Plazas"
                              value={field.cantidad}
                              onChange={(e) =>
                                handleCantidadChange(
                                  key,
                                  e.target.value
                                    .replace(/[^0-9\b]/g, "")
                                    .replace("", "0")
                                )
                              }
                              disabled={isReadOnly || field.valor === "no"  || field.label==="Medicina - Alumnos de años Inferiores por Rotación" } 
                              onKeyDown={(e) =>
                                handleKeyDown(e, key, e.target.value)
                              }
                            />
                            
                        </Grid>
                        <br/>
                        <Grid 
                            
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-column" 
                            flex-direction= "column" item xs={12} className={classes.field}
                            style={{ display: field.label!=="Medicina - Alumnos de años Inferiores por Rotación" ? 'block' : 'none' }}
                        >
                        
                            <FormInput  item xs={3} className={classes.field} style={{width:'100px', padding:'0px 0px'}} fullWidth 
                            value={field.disponible}
                              name="disponibles"
                              label="Disponible"
                              disabled
                            />
                          

                            <FormInput item xs={3} className={classes.field} style={{width:'100px', padding:'0px 0px'}} fullWidth
                            value={field.engestion}
                              name="engestion"
                              label="En gestion"
                              disabled
                            />
                          
                            <FormInput item xs={3} className={classes.field} style={{width:'100px', padding:'0px 0px'}} fullWidth
                            value={field.ocupadas}
                              name="ocupadas"
                              label="Ocupadas"
                              disabled
                            />                          
                        </Grid>                      
                      </Grid>
                    </CardContent>
                  </Card>

                </Grid>

              );
            })}
          </Grid>
        </FormProvider>
      </div>
      {(verHistorial) && (
                  <Grid item xs={12}>
                    <Grid item xs={12} className={classes.field}>
                      <Typography align="center" variant="h6" color="primary">
                        
            <br/> 
                        Historial de Observaciones
                        <br/>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <Table aria-label="Datos estadisticos">
                          <TableHead>
                            <TableRow>                              
                              <TableCell align="left">Fecha Observación</TableCell>
                              <TableCell align="left">Carrera</TableCell>

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
                                    {row.establecimientoCarreraPlaza.carreraprograma.descripcion} 
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
      <Grid container direction="row" justifyContent="flex-end" alignItems="center">
        <Grid item className={classes.field}>
          <Button
            variant="contained"
            color="default"
            onClick = {() => history.goBack()}
          >
            Atrás
          </Button>
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

      
  </div>
  
);
};
  /* {!isReadOnly &&
          (
            <Grid item className={classes.field}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Guardar
              </Button>
            </Grid>
          )}*/
export default Form;
