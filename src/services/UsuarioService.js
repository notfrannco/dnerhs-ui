const SEDE_KEY = "sedeSeleccionada";

const setSedeSeleccionada = (sede) => {
  window.localStorage.setItem(SEDE_KEY, JSON.stringify(sede));
};

const getSedeSeleccionada = () => {
  return JSON.parse(window.localStorage.getItem(SEDE_KEY));
};

const eliminarSedeSeleccionada = () => {
  window.localStorage.removeItem(SEDE_KEY);
};

export { setSedeSeleccionada, getSedeSeleccionada, eliminarSedeSeleccionada };
