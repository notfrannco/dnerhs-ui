

import DnerhsApi from "api/DnerhsApi";

const URL_BASE_CARRERAS = "/carreras-programas/"

const create = async (newCarreraPrograma) => {
    return DnerhsApi.post(URL_BASE_CARRERAS, {
        newCarreraPrograma,
    });
}

const update = async (carrera) => {
    return DnerhsApi.put(URL_BASE_CARRERAS, {
        carrera,
    });
}

const getPage = async ({
    page,
    pageSize
}) => {
    let url = `${URL_BASE_CARRERAS}page?page=${page}&pageSize=${pageSize}`;
   return DnerhsApi(url);
}

const getAll = async () => {
return DnerhsApi(URL_BASE_CARRERAS);
}

export {
    create,
    update,
    getPage,
    getAll
}