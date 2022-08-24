import DnerhsApi from "api/DnerhsApi";

const URL_BASE_NACIONALIDADES = "/nacionalidades/";

const getAll = async () => {
  return DnerhsApi.get(URL_BASE_NACIONALIDADES);
};

export { getAll };
