import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Grid,Modal,Backdrop, TextareaAutosize  } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { FormProvider, useForm } from "react-hook-form";
import DnerhsApi from "../../../api/DnerhsApi";
import FormInput from "../../../Controls/Input";
import FormSelect from "../../../Controls/Select";
import Alert from "../../../components/Alert";
import history from "../../../utils/History";
import { useParams, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/Auth";
import Roles from "../../../constants/Roles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Meses, findById } from "../../../constants/Meses";
import EditIcon from "@material-ui/icons/Edit";
import PracticaEstudianteDialog from "../../../dialogs/PracticaEstudianteDialog";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EstadosCronograma from "../../../constants/EstadosCronograma";
import { getCarrerasProgramas, getTutores, getEstudiantes } from "services/ConvenioService";
import { getAllEstablecimientos } from "services/InstitucionService";
import FormDatePicker from "../../../Controls/DatePicker";
import ConfirmDialog from "dialogs/ConfirmDialog";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

const Form = () => {
  const classes = useStyles();
  const [carreraOptions, setCarreraOptions] = useState([]);
  const [tutoresConvenioList, setTutotresConvenioList] = useState([]);
  const [practicaSelected, setPracticaSelected] = useState({});
  const [fechaDesde, setFechaDesde] = useState();
  const [fechaHasta, setFechaHasta] = useState();
  const [curso, setCurso] = useState();
  const [sent, setSent] = useState(false);
  const [idFormadora, setIdFormadora] = useState();
  const [verHistorial, setIsUpdateH] = useState(false);

  const [establecimientosList, setEstablecimientosList] = useState([]);
  const [plazasList, setPlazasList] = useState([]);
  const [puchOnsaveStudent, setPuchOnsaveStudent] = useState(false);

  
  const [mesesOptions, setMesesOptions] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [practicaResponseData, setPracticaResponseData] = useState({});
  const [estudiantesResponseData, setEstudiantesResponseData] = useState([]);
  const [listPracticas, setListPracticas] = useState([]);
  const [openPracticaDialog, setOpenPracticaDialog] = useState(false);
  const params = useParams();
  const methods = useForm({});
  const { handleSubmit, errors, setValue, getValues } = methods;
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isAprobar, setIsAprobar] = useState(false);
  const { userData, hasRole, hasAnyRole } = useAuth();
  let { state } = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [observacion, setRechazoObservacion] = useState();
  const [bandera, setBandera] = useState("");
  const [botonGuardar, setBotonGuardar] = useState(false);
  let carreraProgramaId="";
  let nombreCarrera="";
  
  useEffect(() => {
    const load = () => {
      try {  
        if (state?.edit || state?.readOnly) {
          setIsUpdate(state.edit);
          setIsReadOnly(state.readOnly? true:false);
          setIsAprobar(state.aprobar);
          setValuesForEdit();
        } else {
          getServerData({ convenioId: params.convenioId });
        }
        if(!hasRole(Roles.ROLE_DNERHS)){
          loadCantidades();
        }
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const confirmOne = async () => {
    
    try {
      if (observacion == "") {
        Alert.show({
          message : "Por favor ingrese una observación",
          type : "error"
        });
        return;
      }

      await trackPromise(DnerhsApi.post(
        `/convenios/practicas/${practicaResponseData.id}/finalizar-cronograma?observacion=${observacion}`
      ));
      setSent(true);
      Alert.show({
        message: "El Cronograma de Practicas ha Finalizado exitosamente.",
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


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenCronogramaDialog =  async (index) => {
    if (getValues("carrera")=== "") {
      Alert.showError("El campo carrera es dato requerido");
      return;
    }else{
      let carreraAux=getValues("carrera");
      let carrAux;
      carreraOptions.forEach((el)=>{
        if(el.id===carreraAux){
          carrAux=el.idCarrera;
        }
      });
      let [responseTutores, responseEstudintes] = await Promise.all([
        getTutores(params.convenioId, carrAux),
        getEstudiantes(params.convenioId, carrAux)
      ])
      setTutotresConvenioList(responseTutores.data);
      setEstudiantesResponseData(responseEstudintes.data);
    
    }
    if (getValues("fechaDesde") === null || getValues("fechaDesde") === "") {
      Alert.showError("El campo Fecha Desde es dato requerido");
      return;
    }
    if (getValues("fechaHasta") === null || getValues("fechaHasta") === "") {
      Alert.showError("El campo Fecha Hasta es dato requerido");
      return;
    }
    if(!puchOnsaveStudent)  {
      loadAllSolicitudes();
    }
    
    
    let fechaDes=getValues("fechaDesde");
    setFechaDesde(fechaDes);
    setFechaHasta(getValues("fechaHasta"));
    setCurso(getValues("curso"))
    setPracticaSelected({});
    setOpenPracticaDialog(true);
  };

  const handleSaveCronogramaPractica = (data) => {
    setPuchOnsaveStudent(true);
    let arraySolicitudes=[];
    arraySolicitudes.push(data.solicitudPlaza);
    setPlazasList(arraySolicitudes);
    if (Object.entries(practicaSelected).length > 0) {
      let { estudiante } = data.convenioEstudiante;

      let practicasFilterByEstudianteId = listPracticas.filter(
        (item) =>
          item.convenioEstudiante?.estudiante?.cedulaIdentidad ==
          estudiante.cedulaIdentidad
      );

      if (
        practicasFilterByEstudianteId &&
        practicasFilterByEstudianteId.length > 1
      ) {
       Alert.showError(
          `El alumno " ${estudiante.nombres} ${estudiante.apellidos} ya se encuentra en el cronograma.`
        );
        return;
      }

      let index = listPracticas.findIndex(
        (item) => item.id === practicaSelected.id
      );

      let practicaOriginal = listPracticas[index];

      let practicaCopy = {
        ...practicaOriginal,
        ...data,
      };

      practicaCopy.modificado = practicaOriginal.id && JSON.stringify(practicaOriginal) !== JSON.stringify(practicaCopy);

      let listCopy = [...listPracticas];
      listCopy.splice(index, 1);

      setListPracticas([...listCopy, { ...practicaCopy }]);
    } else {
      let { estudiante } = data.convenioEstudiante;

      let listPracticasFilter = listPracticas.find(
        (item) =>
          item.convenioEstudiante?.estudiante?.cedulaIdentidad ==
          estudiante.cedulaIdentidad
      );

      if (listPracticasFilter) {
        Alert.showError(
          `El alumno " ${estudiante.nombres} ${estudiante.apellidos} ya se encuentra en el cronograma.`
        );
        return;
      }

      let newPractica = { ...data };

      if (isUpdate) {
        newPractica.modificado = true;
      }

      setListPracticas([...listPracticas, { ...newPractica }]);
    }

    handleCloseCronogramaPractica();
  };

  const handleCloseCronogramaPractica = () => {
    setPracticaSelected({});
    setOpenPracticaDialog(false);
  };

  const getServerData = async ({ convenioId }) => {
    try {

      let [responseCarrerasProgramas, responseEstablecimientos] = await Promise.all([
        getCarrerasProgramas(convenioId),
        getAllEstablecimientos(),
      ]
      )

      setEstablecimientosList(responseEstablecimientos.data);
      loadCarreraOptions(responseCarrerasProgramas.data);
      loadMesesOptions(Meses);



    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      } 
    }
  };

  const loadCarreraOptions = (carreras) => {
    if (carreras) {
      setCarreraOptions(
        carreras.map((carrera) => ({
          label: carrera.carreraPrograma.descripcion,
          id: carrera.id,
          idCarrera: carrera.carreraPrograma.id
        }))
      );
    }
  };

  const loadCantidades = async () => {  
  
    try {
      let url = `/usuarios/${userData.userId}`;   
      const response = await trackPromise(DnerhsApi.get(url)); 
      setSent(true);  
      const formValues = {
        asignadas: response.data.institucionFormadoraResponsableMaximaAutoridadList[0].formadora.asignadas,
        disponibles:response.data.institucionFormadoraResponsableMaximaAutoridadList[0].formadora.disponibles,
        ocupadas:response.data.institucionFormadoraResponsableMaximaAutoridadList[0].formadora.ocupadas
      };
      setIdFormadora(response.data.institucionFormadoraResponsableMaximaAutoridadList[0].formadora.id);

      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });
    } catch (error) {
     console.log(error);
    }   
  };
 const loadAllSolicitudes = async () => {  
    try {
      let valueCarrera=getValues("carrera");
      let carreraIdprograma;
    let carreraDescripcionPrograma;
    carreraOptions.forEach((el)=>{
      if(el.id===valueCarrera){
        carreraIdprograma=el.idCarrera;
        carreraDescripcionPrograma=el.label;
      }
    });
      let url = `/solicitudes-plazas/${idFormadora}/${carreraIdprograma}/asignaciones`;   
      const response = await trackPromise(DnerhsApi.get(url));  
      setSent(true); 
      let arrayListPlazasPut=[];
      let arrayListPlazasPost=[];
      response.data.forEach((u)=>{        
        if(u.estado==="Aprobado por DNERHS"  || u.estado==="Utilizado"){
          if(typeof(params.practicaId)!= 'undefined' && (u.practicaId!=null  && u.practicaId.toString()===params.practicaId)){
            arrayListPlazasPut.push(u);
          }else{
            if(u.practicaId===null ||  u.practicaId===0 || typeof(u.practicaId)=== 'undefined'){
              arrayListPlazasPost.push(u);
            }
          }
        }
      })
      if(typeof(params.practicaId)!= 'undefined' ||  params.practicaId===null){
        setPlazasList(arrayListPlazasPut);
      }else{
        setPlazasList(arrayListPlazasPost);
      }
      

    } catch (error) {
     console.log(error);
    }   
  };
  const loadMesesOptions = (meses) => {
    if (meses) {
      setMesesOptions(
        meses.map((mes) => ({
          label: mes.nombre,
          id: mes.id,
        }))
      );
    }
  };

  const setValuesForEdit = async () => {
    try {
      const { data: practicaResponseData } = await trackPromise(DnerhsApi.get(
        `/convenios/practicas/${params.practicaId}`
      ));
      setSent(true);
      setPracticaResponseData(practicaResponseData);

      await getServerData({ convenioId: practicaResponseData.convenio.id });

      const formValues = {
        carrera: practicaResponseData.convenioCarrera.id,
        materia: practicaResponseData.materia,
        curso: practicaResponseData.curso,
        semestre: practicaResponseData.semestre,
        fechaDesde: practicaResponseData.practicaDetalleList.length>0? practicaResponseData.practicaDetalleList[0].fechaDesde:"00/00/00 00:00:00" ,
        fechaHasta: practicaResponseData.practicaDetalleList.length>0? practicaResponseData.practicaDetalleList[0].fechaHasta:"00/00/00 00:00:00" ,
        observacion: practicaResponseData.observacion,
        asignadas: practicaResponseData.convenioCarrera.convenio.institucionFormadora.asignadas,
            disponibles:practicaResponseData.convenioCarrera.convenio.institucionFormadora.disponibles,
            ocupadas:practicaResponseData.convenioCarrera.convenio.institucionFormadora.ocupadas
      };
      setIdFormadora(practicaResponseData.convenioCarrera.convenio.institucionFormadora.id);

      setFechaDesde(practicaResponseData.practicaDetalleList.length>0? practicaResponseData.practicaDetalleList[0].fechaDesde:"00/00/00 00:00:00");
      setFechaHasta(practicaResponseData.practicaDetalleList.length>0? practicaResponseData.practicaDetalleList[0].fechaHasta:"00/00/00 00:00:00");
      Object.keys(formValues).forEach((field) => {
        setValue(field, formValues[field]);
      });
      practicaResponseData.practicaDetalleList.forEach((k)=>{
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
      setListPracticas(practicaResponseData.practicaDetalleList);
         
      const { data: historialResponseData } = await trackPromise(DnerhsApi.get(`/practicas-observaciones/${params.practicaId}/observaciones`
      ));
      setSent(true);
      if(historialResponseData.length>0){
        
        setHistorial(historialResponseData);
        setIsUpdateH(true);
        //reset2();
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
       } 
    }
  };
    //handlefechaDesdeChange
  const handlefechaDesdeChange = async (e) => {
      setFechaDesde(e);
  }
  const onSubmit = async (data) => {
    if (data.carrera === "") {
      Alert.showError("El campo carrera es dato requerido");
      return;
    }
    if (data.fechaDesde === null || data.fechaDesde === "") {
      Alert.showError("El campo Fecha Desde es dato requerido");
      return;
    }
    if (data.fechaHasta === null || data.fechaHasta === "") {
      Alert.showError("El campo Fecha Hasta es dato requerido");
      return;
    }

    let url = "/convenios/practicas ";
    let carreraIdprograma;
    let carreraDescripcionPrograma;
    carreraOptions.forEach((el)=>{
      if(el.id===data.carrera){
        carreraIdprograma=el.idCarrera;
        carreraDescripcionPrograma=el.label;
      }
    });
    const payload = {
      convenioCarrera: { id: data.carrera , carreraPrograma: { id: carreraIdprograma, descripcion: carreraDescripcionPrograma}},
      materia: data.materia,
      curso: data.curso,
      semestre: data.semestre,
      practicaDetalleList: listPracticas,
    };

    try {
      let message = "";

      if (isUpdate) {
        let payloadUpt = { ...practicaResponseData, ...payload };

        let { data } = await trackPromise(DnerhsApi.put(url, {
          ...payloadUpt,
        }));
        setSent(true);
        setPracticaResponseData(data);

        message = "Datos guardados exitosamente.";
      } else {
        payload.convenio = {
          id: params.convenioId,
        };

        let { data } = await trackPromise(DnerhsApi.post(url, {
          ...payload,
        }));
        setSent(true);
        setPracticaResponseData(data);

        message = "Datos actualizados exitosamente.";
      }

      Alert.show({
        message,
        type: "success",
      });
      setBotonGuardar(true);
      setIsReadOnly(true);
      //history.goBack();
    } catch (error) {
      console.log(error);
      if (error.response) {
       Alert.showServerError(error);
      } 
    }
  };
  const handleModificar = async () => {
    try {
      let { id } = practicaResponseData;
      await trackPromise(DnerhsApi.post(
        `/convenios/practicas/${id}/modificar-cronograma-aprobado`
      ));
      setSent(true);
      Alert.show({
        message: "Modifición Realizada con exitosamente.",
        type: "success",
      });

      history.goBack();
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
       } 
    }
  }
  const handleSolicitarRevision = async () => {
    try {
      let { id } = practicaResponseData;

      let estado = EstadosCronograma.PENDIENTE_APROBACION;

      if (
        practicaResponseData.estado === EstadosCronograma.PRACTICA_RECHAZADA
      ) {
        estado = EstadosCronograma.PRACTICA_PENDIENTE_MODIFICACIONES_APROBACION;
      }

      await trackPromise(DnerhsApi.post(
        `/convenios/practicas/${id}/solicitar-revision?estado=${estado}`
      ));
      setSent(true);
      Alert.show({
        message: "Solicitud de revisión enviada exitosamente.",
        type: "success",
      });

      history.goBack();
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
       } 
    }
  };

  const handleAprobarSolicitudRevision = async () => {
    try {
      let { id } = practicaResponseData;

      let estado = EstadosCronograma.PRACTICA_APROBADA;

      if ( practicaResponseData.estado === EstadosCronograma.PRACTICA_PENDIENTE_MODIFICACIONES_APROBACION
      ) {
        estado = EstadosCronograma.PRACTICA_MODIFICACIONES_APROBADA;
      }

      let observacion = getValues("observacion");

      await trackPromise(DnerhsApi.post(
        `/convenios/practicas/${id}/aprobacion?estado=${estado}&observacion=${observacion}`
      ));
      setSent(true);
      Alert.show({
        message: "Solicitud aprobada exitosamente.",
        type: "success",
      });

      history.goBack();
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
       } 
    }
  };

  
  const handleDeletePractica = (index) => {
    let listCopy = [...listPracticas];
    listCopy.splice(index, 1);

    setListPracticas(listCopy);
  };

  const handleOpenEstudianteDialog = async (index) => {
    loadAllSolicitudes();
    setCurso(getValues("curso"))
    let estudiante = { ...listPracticas[index] };
    setPracticaSelected(estudiante);
    setOpenPracticaDialog(true);
    let carreraAux=getValues("carrera");
    let carrAux;
      carreraOptions.forEach((el)=>{
        if(el.id===carreraAux){
          carrAux=el.idCarrera;
        }
      });
    let [responseTutores, responseEstudintes] = await Promise.all([
      getTutores(params.convenioId, carrAux),
      getEstudiantes(params.convenioId, carrAux)
    ])
    setTutotresConvenioList(responseTutores.data);
    setEstudiantesResponseData(responseEstudintes.data);
  };

  const showObservacion =
    practicaResponseData.id &&
    (practicaResponseData.estado === EstadosCronograma.PENDIENTE_APROBACION ||
      practicaResponseData.estado === EstadosCronograma.PRACTICA_RECHAZADA ||
      practicaResponseData.estado === EstadosCronograma.PRACTICA_PENDIENTE_MODIFICACIONES_APROBACION);

  const showButtonSolicitar = practicaResponseData.id &&
    (practicaResponseData.estado === EstadosCronograma.CREADA ||
      practicaResponseData.estado === EstadosCronograma.PRACTICA_RECHAZADA );

  const showButtonsAprobacion = hasAnyRole([Roles.ROLE_DNERHS, Roles.ROLE_ADMIN]) && isAprobar;

  const showButtonFinalizar = practicaResponseData.id &&
    (
      practicaResponseData.estado === EstadosCronograma.PRACTICA_APROBADA ||
      practicaResponseData.estado === EstadosCronograma.PRACTICA_MODIFICACIONES_APROBADA);
  const checkDayFormat = (day) => {
    return day ? (
      <CheckIcon color="secondary" />
    ) : (
      <CloseIcon color="primary" />
    );
  };
  /*MODAL*/
  const [modal, setModal]=useState(false);
  const abrirCerrarModal =(accion)=>{
    setModal(!modal);
    setBandera(accion);    
  }
    const cerrarModal =()=>{  
    setModal(!modal);    
  }
  const handleObservacionChange = ( value) => {
    //rechazoObservacion=value;
    setRechazoObservacion(value);
  };
  
  const handleRechazarSolicitudRevision = async () => {
    if(bandera!="rechazar"){
      abrirCerrarModal("");
      confirmOne();
    }else{
      abrirCerrarModal("");
      try {
        let { id } = practicaResponseData;

        //let observacion = getValues("observacion");

        if (observacion == "") {
          Alert.show({
            message : "Por favor ingrese una observación",
            type : "error"
          });
          return;
        }

        await trackPromise(DnerhsApi.post(
          `/convenios/practicas/${id}/aprobacion?estado=${EstadosCronograma.PRACTICA_RECHAZADA}&observacion=${observacion}`
        ));
        setSent(true);
        Alert.show({
          message: "Solicitud rechazada exitosamente.",
          type: "success",
        });

        history.goBack();
      } catch (error) {
        console.log(error);
        if (error.response) {
          Alert.showServerError(error);
        } 
      }
    }
  };
  //  <Box sx={classes.box}>
  const bodyModal= (
    
    <div className={classes.modal} align="center" classes={{focused: classes.outlinedInputFocused}}>
      <Paper>
        <Card>
        <CardContent>
          <div>
          <br/>
          <Typography align="center" variant="h5" color="primary">
          Observaciones Cronograma
              </Typography>
      
               <br/>
  
          </div>
          <br/> <br/>
          <Grid item className={classes.field}>
          <TextareaAutosize aria-label="Observacion"  rows={6} rowsMax={10}  placeholder="Observaciones" onChange={(e) =>
                                  handleObservacionChange(e.target.value)}
                                  style={{width: 600, fontSize: 0.875+'rem', fontFamily: 'Roboto', fontWeight: 400,
                                  lineHeight: 1.43,
                                  letterSpacing: 0.01071+'em', borderRadius: 10+'px'}}
                                  />
          </Grid>
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
                onClick={handleRechazarSolicitudRevision}
                >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      </Paper>
    </div>
    
  )
 
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
 
/*linea 589
  <TableCell align="center">
                          {findById(row.mesDesde)?.nombre +
                            " a " +
                            findById(row.mesHasta)?.nombre}{" "}
                        </TableCell>
*/
  return (
    <>
      <Paper>
        <Box padding={5}>
          <Grid item xs={12}>
            <Typography align="center" variant="h5" color="primary">
              Cronograma de Prácticas
            </Typography>
            <br/>
          </Grid>
          <Grid item xs={12}>
            <FormProvider {...methods}>
              <form>
                <Grid container direction="row">
                  <Grid item xs={6}>
                    <Grid item xs={12} className={classes.field}>
                      <FormSelect
                        name="carrera"
                        label="Carrera"
                        disabled={isReadOnly || isUpdate}
                        options={carreraOptions}  
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        name="materia"
                        label="Materia"
                        disabled={isReadOnly}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.field} >
                      <FormDatePicker name="fechaDesde" label="Fecha desde" disabled={isReadOnly} />                          
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        type="number"
                        name="curso"
                        label="Curso"
                        disabled={isReadOnly}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                      <FormInput
                        type="number"
                        name="semestre"
                        label="Semestre"
                        disabled={isReadOnly}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.field}>
                          <FormDatePicker name="fechaHasta" label="Fecha hasta"  disabled={isReadOnly}/>
                        </Grid>
                  </Grid>
               
                </Grid>
                <Grid container direction="row" >
                  
                <Grid item xs={3} className={classes.field}>
                      <FormInput
                        name="asignadas"
                        label="Asignadas"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3} className={classes.field}>
                      <FormInput
                        name="disponibles"
                        label="Disponibles"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3} className={classes.field}>
                      <FormInput
                        name="ocupadas"
                        label="Ocupadas"
                        disabled
                      />
                    </Grid>
                 
                  
                  
                </Grid>
                
              </form>
            </FormProvider>
          </Grid>
          <Grid item xs={12}>
       
          <br/>    <br/>
            <Typography align="center" variant="h6" color="primary">
              Estudiantes
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="Datos estadisticos">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">C.I.</TableCell>
                      <TableCell align="left">Año</TableCell>
                      <TableCell align="left">Alumno</TableCell>
                      <TableCell align="left">D</TableCell>
                      <TableCell align="left">L</TableCell>
                      <TableCell align="left">M</TableCell>
                      <TableCell align="left">X</TableCell>
                      <TableCell align="left">J</TableCell>
                      <TableCell align="left">V</TableCell>
                      <TableCell align="left">S</TableCell>
                      <TableCell align="left">Total Horas</TableCell>
                      <TableCell align="left">Tutor</TableCell>
                      <TableCell align="left">Establecimiento</TableCell>
                      <TableCell align="left">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listPracticas.map((row, index) => (
                      <TableRow
                        style={
                          row.modificado ? { backgroundColor: "#F6F7AE" } : {}
                        }
                        key={index}
                      >
                        <TableCell align="left">
                          {row.convenioEstudiante?.estudiante.cedulaIdentidad}
                        </TableCell>
                        <TableCell align="left">{row.anio}</TableCell>
                        <TableCell align="left">
                          {row.convenioEstudiante?.estudiante.nombres}&nbsp;{row.convenioEstudiante?.estudiante.apellidos}
                        </TableCell>
                       
                        <TableCell align="left">
                          {checkDayFormat(row.domingo)}
                        </TableCell>
                        <TableCell align="left">
                          {checkDayFormat(row.lunes)}
                        </TableCell>
                        <TableCell align="left">
                          {checkDayFormat(row.martes)}
                        </TableCell>
                        <TableCell align="left">
                          {checkDayFormat(row.miercoles)}
                        </TableCell>
                        <TableCell align="left">
                          {checkDayFormat(row.jueves)}
                        </TableCell>
                        <TableCell align="left">
                          {checkDayFormat(row.viernes)}
                        </TableCell>
                        <TableCell align="left">
                          {checkDayFormat(row.sabado)}
                        </TableCell>
                       
                        <TableCell align="left">
                          {row.totalHoras + " hs"}
                        </TableCell>
                        <TableCell align="left">
                          {row.convenioTutor?.tutor?.nombres}&nbsp;{ row.convenioTutor?.tutor?.apellidos}
                        </TableCell>
                        <TableCell align="left">
                          {row.establecimiento?.nombreServicio.nombre}
                        </TableCell>
                        <TableCell align="left">
                          { !isReadOnly ? (
                            <>
                              <Tooltip title="Eliminar" aria-label="eliminar">
                                <IconButton
                                  size="small"
                                  aria-label="eliminar"
                                  color="default"
                                  disabled={!hasRole(Roles.ROLE_USER)}
                                  onClick={() => handleDeletePractica(index)}
                                  
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar" aria-label="editar">
                                <IconButton
                                  size="small"
                                  aria-label="editar"
                                  color="secondary"
                                  disabled={!hasRole(Roles.ROLE_USER)}
                                  onClick={() =>
                                    handleOpenEstudianteDialog(index)
                                  }
                                  
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Ver" aria-label="ver">
                              <IconButton
                                size="small"
                                aria-label="ver"
                                color="secondary"
                                onClick={() =>
                                  handleOpenEstudianteDialog(index)
                                }
                                className={classes.field}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignContent="flex-end"
            >
              {!isReadOnly && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  disabled={!hasRole(Roles.ROLE_USER)}
                  onClick={handleOpenCronogramaDialog}
                  className={classes.field}
                >
                  Agregar
                </Button>
              )}
            </Grid>
          </Grid>
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
          <Grid item xs={12}>
            <Box paddingTop={3}>
              <Grid
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
                { (hasRole(Roles.ROLE_USER)  && (practicaResponseData.estado==='Práctica aprobada por DNERHS' || practicaResponseData.estado==='Práctica con modificaciones aprobadas por DNERHS')) && (
                  <>      
                                
                      <Grid item className={classes.field}>
                        <Button   style={{ color:"#fff" ,  backgroundColor: "#333e65"  }}
                          variant="contained"
                          color="#333e65"
                          onClick={handleModificar}
                          
                        >
                          Modificar 
                        </Button>
                      </Grid>  
                                                  
                  </>
                )}
                {hasRole(Roles.ROLE_USER) && (
                  <>
                    {!isReadOnly && (
                      <Grid item className={classes.field}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={isReadOnly}
                          onClick={handleSubmit(onSubmit)}
                        >
                          Guardar
                        </Button>
                      </Grid>
                    )}                  
                   
                  </>
                )}
                {hasRole(Roles.ROLE_USER) && (
                  <>
                  

                    {(showButtonSolicitar || botonGuardar) && (
                      <Grid item className={classes.field}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleSolicitarRevision}
                        >
                          Solicitar
                        </Button>
                      </Grid>
                    )}
                   
                  </>
                )}
                {showButtonsAprobacion && (
                  <>
                    <Grid item className={classes.field}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => abrirCerrarModal("rechazar")}
                      >
                        Rechazar
                      </Button>
                    </Grid>
                    <Grid item className={classes.field}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAprobarSolicitudRevision}
                      >
                        Aprobar
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box paddingTop={3}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
              
                {hasRole(Roles.ROLE_USER) && (
                  <>
                  

                    {showButtonFinalizar && (
                      <Grid item className={classes.field}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => 
                            abrirCerrarModal("finalizar")                            
                          }
                        >
                          Finalizar Cronograma
                        </Button>
                      </Grid>
                    )}
                   
                  </>
                )}
                
              </Grid>
            </Box>
          </Grid>
          
        </Box>
        <ConfirmDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onAccept={confirmOne}
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
     
      <PracticaEstudianteDialog
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        curso={curso}
        dataForEdit={practicaSelected}
        tutoresConvenioList={tutoresConvenioList}
        establecimientosList={establecimientosList}
        plazasList={plazasList}
        estudiantesConvenioList={estudiantesResponseData}
        open={openPracticaDialog}
        isReadOnly={isReadOnly}
        onSave={handleSaveCronogramaPractica}
        onClose={handleCloseCronogramaPractica}
        aria-labelledby="form-dialog-title"
      />
    </>
  );
};

export default Form;
