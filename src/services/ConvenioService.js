import DnerhsApi from "api/DnerhsApi";

const URL_BASE_CONVENIOS = "/convenios/";

const getCarrerasProgramas = async (convenioId) => {
  return DnerhsApi.get(`${URL_BASE_CONVENIOS}${convenioId}/carreras-programas`);
};


const getTutores = async (convenioId, carreraId) => {
  return DnerhsApi.get(`${URL_BASE_CONVENIOS}${convenioId}/carrera/${carreraId}/tutores`);
};

const getEstudiantes = async (convenioId, carreraId) => {
  return DnerhsApi.get(`${URL_BASE_CONVENIOS}${convenioId}/carrera/${carreraId}/estudiantes`);
};
const getEstudiante = async (convenioEstudianteId) => {
  return DnerhsApi.get(
    `${URL_BASE_CONVENIOS}estudiantes/${convenioEstudianteId}`
  );
};

export { getCarrerasProgramas, getTutores, getEstudiantes, getEstudiante };
