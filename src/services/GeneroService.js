import DnerhsApi from "api/DnerhsApi";

const URL_BASE_GENEROS = "/generos/";

const getAll = async () => {
  return DnerhsApi.get(URL_BASE_GENEROS);
};

export { getAll };
