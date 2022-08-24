import DnerhsApi from "api/DnerhsApi";

const URL_BASE_DATOS_PERSONALES = "/datos-personales/";

const findByNumeroCedula = async (numeroCedula) => {
    return DnerhsApi.get(`${URL_BASE_DATOS_PERSONALES}${numeroCedula}`);
};

export {
    findByNumeroCedula
};
