import DnerhsApi from "api/DnerhsApi";

const URL_BASE_INSTITUCIONES = "/instituciones";

const URL_BASE_INSTITUCIONES_ESTABLECIMIENTOS = `${URL_BASE_INSTITUCIONES}/establecimientos/`;

const getAllEstablecimientos = async () => {
  return DnerhsApi.get(URL_BASE_INSTITUCIONES_ESTABLECIMIENTOS);
};

export { getAllEstablecimientos };