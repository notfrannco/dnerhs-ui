import DnerhsApi from 'api/DnerhsApi';
import history from 'utils/History';
import jwtDecode from "jwt-decode";
import { eliminarSedeSeleccionada } from "services/UsuarioService";

const JWT_TOKEN_KEY = "dnerhs-jwt";

const login = async (username, password) => {
  const payload = {
    username,
    password,
  };
  try {
    DnerhsApi.defaults.headers.common["Authorization"] = "";

    const { data } = await DnerhsApi.post("/autenticar", {
      ...payload
    });


    let jwtToken = data.token;

    localStorage.setItem(JWT_TOKEN_KEY, jwtToken);

    DnerhsApi.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

    const token = jwtDecode(jwtToken);
    const now = new Date().getTime() / 1000;
    if (token.exp - now > 0) {
      return {
        role: token.role,
        status: "OK"
      };
    } else {
      return { status: "ERROR" };
    }

  } catch (error) {
    if (error.response?.status == 401) {
      return { status: "ERR", message: "Usuario o contraseña incorrecto" };
    } else {
      return { status: "ERR", message: "Ha ocurrido un error al intentar autenticarse, por favor intente nuevamente." };
    }
  }
};

const getUserPrincipal = () => {
  try {
    let jwtToken = localStorage.getItem(JWT_TOKEN_KEY);
    if (jwtToken) {
      let jwtTokenDecode = jwtDecode(jwtToken);
      const now = new Date().getTime() / 1000;
      if (!jwtTokenDecode.exp - now > 0) {
         throw Error("Token expirado");
      }
      return {
        role: jwtTokenDecode.role,
        username: jwtTokenDecode.sub,
        roleName: jwtTokenDecode.role?.descripcion,
        userId: jwtTokenDecode.id
      }
    } 
  } catch (error) {
    console.log(error);
  }

}

const logout = async () => {
  try {
    clearToken();
    eliminarSedeSeleccionada();
    history.push(`/login`);
    return { status: 'OK' };
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const clearToken = () => {
  localStorage.removeItem(JWT_TOKEN_KEY);
  DnerhsApi.defaults.headers.common['Authorization'] = '';
}

const isAuthenticated = () => {
  return getUserPrincipal() ? true : false;
}

export {
  login,
  logout,
  getUserPrincipal,
  isAuthenticated,
  clearToken
}

