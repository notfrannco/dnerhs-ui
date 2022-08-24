import InstitucionList from "../layout/institucion/List";
import DocentesForm from "../layout/Docentes/Form";
import CarrerasList from "layout/Carreras/List";
import CarrerasForm from "layout/Carreras/Form";
import SolicitudPlazaDisponibleList from "layout/AsignacionPlazas/Solicitudes/List";
import SolicitudPlazaDisponibleForm from "layout/AsignacionPlazas/Solicitudes/Form";
import TutoresConvenioList from "../layout/SolicitudConvenio/Tutores/List";
import TutoresConvenioForm from "../layout/SolicitudConvenio/Tutores/Form";
import EstudiantesConvenioList from "../layout/SolicitudConvenio/Estudiantes/List";
import EstudiantesConvenioForm from "../layout/SolicitudConvenio/Estudiantes/Form";
import ProfesionalesFormadosConvenioList from "../layout/SolicitudConvenio/ProfesionalesFormados/List";
import ProfesionalesFormadosConvenioForm from "../layout/SolicitudConvenio/ProfesionalesFormados/Form";
import CronogramaPracticaConvenioList from "../layout/SolicitudConvenio/CronogramaPractica/List";
import CronogramaPracticaConvenioForm from "../layout/SolicitudConvenio/CronogramaPractica/Form";
import ConfirmacionPracticaConvenioList from "../layout/SolicitudConvenio/ConfirmacionPractica/List";
import ConfirmacionPracticaConvenioForm from "../layout/SolicitudConvenio/ConfirmacionPractica/Form"
import ResponsableList from "../layout/Responsable/List";
import ResponsableForm from "../layout/Responsable/Form";
import ResponsableEstablecimientoList from "../layout/ResponsableEstablecimiento/List";
import ResponsableEstablecimientoForm from "../layout/ResponsableEstablecimiento/Form";
import AlumnosList from "../layout/Alumnos/List";
import AlumnosForm from "../layout/Alumnos/Form";
import ConvenioCarrerasList from "../layout/SolicitudConvenio/Carreras/List";
import ConvenioCarrerasForm from "../layout/SolicitudConvenio/Carreras/Form";
import MateriasList from "../layout/Materias/List";
import MateriasForm from "../layout/Materias/Form";
import AutoridadesList from "../layout/Autoridades/List";
import RectorList from "../layout/Autoridades/Rector/List";
import RectorForm from "../layout/Autoridades/Rector/Form";
import DirectorList from "../layout/Autoridades/Director/List";
import DirectorForm from "../layout/Autoridades/Director/Form";
import DecanoList from "../layout/Autoridades/Decano/List";
import DecanoForm from "../layout/Autoridades/Decano/Form";
import EstablecimientosList from "../layout/Establecimientos/List";
import EstablecimientosForm from "../layout/Establecimientos/Form";
import CamposPracticaForm from "../layout/CamposPractica/Form";
import CamposPracticaEstablecimientoList from "../layout/CamposPracticaEstablecimiento/List";
import CamposPracticaEstablecimientoForm from "../layout/CamposPracticaEstablecimiento/Form";
import DocsRespaldo from "../layout/DocsRespaldo/List";
import PracticasEstudiantesList from "../layout/PracticasEstudiantes/List";
import PracticasEstudiantesForm from "../layout/PracticasEstudiantes/Form";
import SedeInstitucion from "../layout/institucion/Form";
import RevSolicitudResp from "../layout/RevSolicitudResp/List";
import SolicitudesConvenio from "../layout/SolicitudConvenio/List";
import SolicitudesConvenioForm from "../layout/SolicitudConvenio/Form";
import SolicitudSuscripcion from "../layout/SolicitudSuscripcion/List";
import SedesSelection from "../layout/SedesSelection/Form";
import DatosCertPracticaForm from "../layout/DatosCertPracticas/Form";
import DatosCertPracticaList from "../layout/DatosCertPracticas/List";
import RegistroVigencia from "../layout/SolicitudConvenio/RegistroVigencia/Form";
import DescargarConvenio from "../layout/SolicitudConvenio/DescargarConvenio/List";
import EstablecimientoCamposPracticaForm from "../layout/Establecimientos/Secciones/CampoPractica/Form";
import EstablecimientoEncargadoCamposPracticaForm from "../layout/Establecimientos/Secciones/EncargadoCampoPractica/Form";
import CapacidadCamposPracticaForm from "../layout/Establecimientos/Secciones/CapacidadCampoPractica/Form";
import ServicioCamposPracticaForm from "../layout/Establecimientos/Secciones/Servicios/Form";
import ProfesionalCamposPracticaForm from "../layout/Establecimientos/Secciones/Profesional/Form";
import PlazaCamposPracticaForm from "../layout/Establecimientos/Secciones/PlazasDisponibles/Form";
import Forbidden from "../components/Forbidden";
import CronogramaEstablecimiento from "../layout/Establecimientos/Secciones/Cronograma/List";
import ConstanciasList from "../layout/Constancias/List";
import ConstanciasForm from "../layout/Constancias/Form";
import Roles from "../constants/Roles";
import CambioPass from "components/CambioPass";

export default [

    {
        path: "/cambioPass",
        component: CambioPass,
        rolesRequired : []
    },
    {
        path: "/instituciones/crear/:convenioId",
        component: SedeInstitucion,
        rolesRequired : []
    },

    {
        path: "/instituciones",
        component: InstitucionList,
        rolesRequired : []
    },
    {
        path: "/carreras/crear",
        component: CarrerasForm,
        rolesRequired : []
    },
    {
        path: "/carreras/editar/:carreraId",
        component: CarrerasForm,
        rolesRequired : []
    },
    {
        path: "/carreras",
        component: CarrerasList,
        rolesRequired : [Roles.ROLE_DNERHS]
    },
    {
        path: "/docentes/crear/:convenioId",
        component: DocentesForm,
        rolesRequired : []
    },
    {
        path: "/docentes/:convenioId",
        rolesRequired : []
    },
    {
        path: "/responsable/crear",
        component: ResponsableForm,
        rolesRequired : []
    },
    {
        path: "/responsable/revision/:id",
        component: ResponsableForm,
        rolesRequired : []
    },
    {
        path: "/alumnos/crear/:convenioId",
        component:  AlumnosForm,
        rolesRequired : []
    },
    {
        path: "/alumnos/:convenioId",
        component:  AlumnosList,
        rolesRequired : []
    },
    {
        path: "/convenios/carreras/crear/:convenioId",
        component: ConvenioCarrerasForm,
        rolesRequired : []
    },
    {
        path: "/convenios/carreras/editar/:convenioCarreraId",
        component: ConvenioCarrerasForm,
        rolesRequired : []
    },
    {
        path: "/convenios/carreras/:convenioId",
        component: ConvenioCarrerasList,
        rolesRequired : []
    },
    {
        path: "/materias/crear/:convenioId",
        component:  MateriasForm,
        rolesRequired : []
    },
    {
        path: "/materias/:convenioId",
        component: MateriasList,
        rolesRequired : []
    },
    {
        path: "/rector/crear/:convenioId",
        component: RectorForm,
        rolesRequired : []
    },
    {
        path: "/director/crear/:convenioId",
        component: DirectorForm,
        rolesRequired : []
    },
    {
        path: "/rector",
        component: RectorList,
        rolesRequired : []
    },
    {
        path: "/director",
        component: DirectorList,
        rolesRequired : []
    },
    {
        path: "/decanos/crear/:convenioId",
        component: DecanoForm,
        rolesRequired : []
    },
    {
        path: "/decanos/ver/:convenioDecanoId",
        component: DecanoForm,
        rolesRequired : []
    },
    {
        path: "/decanos/:convenioId",
        component: DecanoList,
        rolesRequired : []
    },
    {
        path: "/establecimientos/plazaCamposPractica/crear/:establecimientoId",
        component: PlazaCamposPracticaForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/profesionalCamposPractica/crear/:establecimientoId",
        component: ProfesionalCamposPracticaForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/servicioCamposPractica/crear/:establecimientoId",
        component: ServicioCamposPracticaForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/capacidadCamposPractica/crear/:establecimientoId",
        component: CapacidadCamposPracticaForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/encargadoCamposPractica/crear/:establecimientoId",
        component: EstablecimientoEncargadoCamposPracticaForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/camposPractica/crear/:establecimientoId",
        component: EstablecimientoCamposPracticaForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/cronograma/aprobados",
        component: CronogramaEstablecimiento,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/crear/:establecimientoId",
        component: EstablecimientosForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
    },
    {
        path: "/establecimientos",
        component: EstablecimientosList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
    },
    {
        path: "/miEstablecimiento",
        component: EstablecimientosForm,
        rolesRequired : [Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO]
    },
    {
        path: "/establecimientos/responsables/crear",
        component: ResponsableEstablecimientoForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
    },

    {
        path: "/establecimientos/responsables/editar/:id",
        component: ResponsableEstablecimientoForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
    },

    {
        path: "/establecimientos/responsables",
        component: ResponsableEstablecimientoList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
    },
    {
        path: "/camposPractica/crear",
        component: CamposPracticaForm,
        rolesRequired : []
    },
    {
        path: "/camposPracticaEstablecimiento/crear",
        component: CamposPracticaEstablecimientoForm,
        rolesRequired : []
    },
    {
        path: "/camposPracticaEstablecimiento",
        component: CamposPracticaEstablecimientoList,
        rolesRequired : []
    },
    {
        path: "/docsRespaldo/:convenioId",
        component: DocsRespaldo,
        rolesRequired : []
    },
    {
        path: "/practicasEstudiantes/crear/:convenioId",
        component: PracticasEstudiantesForm,
        rolesRequired : []
    },
    {
        path: "/practicasEstudiantes/:convenioId",
        component: PracticasEstudiantesList,
        rolesRequired : []
    },
    {
        path: "/revSolicitudResp",
        component: RevSolicitudResp,
        rolesRequired : []
    },
    {
        path: "/convenios/crear",
        component: SolicitudesConvenioForm,
        rolesRequired : []
    },
    {
        path: "/convenios/editar/:id",
        component: SolicitudesConvenioForm,
        rolesRequired : []
    },
    {
        path: "/convenios",
        component: SolicitudesConvenio,
        rolesRequired : []
    },
    {
        path: "/convenios/asignacionPlazas/solicitudes/:convenioId",
        component: SolicitudPlazaDisponibleList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/asignacionPlazas/solicitudes/crear/:convenioId",
        component: SolicitudPlazaDisponibleForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/asignacionPlazas/solicitudes/ver/:convenioId",
        component: SolicitudPlazaDisponibleForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/tutores/:convenioId",
        component: TutoresConvenioList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/tutores/crear/:convenioId",
        component: TutoresConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/tutores/editar/:convenioTutorId",
        component: TutoresConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/estudiantes/:convenioId",
        component: EstudiantesConvenioList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/estudiantes/crear/:convenioId",
        component: EstudiantesConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/estudiantes/editar/:convenioEstudianteId",
        component: EstudiantesConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/profesionalesFormados/:convenioId",
        component: ProfesionalesFormadosConvenioList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/profesionalesFormados/crear/:convenioId",
        component: ProfesionalesFormadosConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/profesionalesFormados/editar/:convenioProfesionalesFormadosId",
        component: ProfesionalesFormadosConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },

    {
        path: "/convenios/cronogramasPracticas/:convenioId",
        component: CronogramaPracticaConvenioList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/cronogramasPracticas/crear/:convenioId",
        component: CronogramaPracticaConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/cronogramasPracticas/editar/:convenioId/:practicaId",
        component: CronogramaPracticaConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/cronogramasPracticas/ver/:convenioId/:practicaId",
        component: CronogramaPracticaConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/confirmacionesPracticas/:convenioId",
        component: ConfirmacionPracticaConvenioList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/convenios/confirmacionesPracticas/confirmar/:convenioPracticaId",
        component: ConfirmacionPracticaConvenioForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/responsables",
        component: ResponsableList,
        rolesRequired : []
    },
    {
        path: "/solicitudSuscripcion/:convenioId",
        component: SolicitudSuscripcion,
        rolesRequired : []
    },
    {
        path: "/autoridades/:convenioId",
        component: AutoridadesList,
        rolesRequired : []
    },
    {
        path: "/sedesSelection",
        component: SedesSelection,
        rolesRequired : []
    },
    {
        path: "/datosPracticas/crear/:convenioId",
        component: DatosCertPracticaForm,
        rolesRequired : []
    },
    {
        path: "/datosPracticas/:convenioId",
        component: DatosCertPracticaList,
        rolesRequired : []
    },
    {
        path: "/descargarConvenio/:convenioId",
        component: DescargarConvenio,
        rolesRequired : []
    },
    {
        path: "/registroVigencia/:convenioId",
        component: RegistroVigencia,
        rolesRequired : []
    },
    {
        path: "/constancias",
        component: ConstanciasList,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/constancias/generar",
        component: ConstanciasForm,
        rolesRequired : [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS, Roles.ROLE_USER]
    },
    {
        path: "/forbidden",
        component: Forbidden,
        rolesRequired : []
    },
    

]

const getMainRouteForRole = (role) => {
    switch (role) {
        case Roles.ROLE_USER:
            return "/sedesSelection"
        case Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO:
                return "/miEstablecimiento"
    
        default:
            return "/convenios";
    }
}

export {
    getMainRouteForRole 
}