import { createTheme } from "@material-ui/core/styles";
import Roles from "constants/Roles";

const defaultPalette = {
  primary: {
    main: "#333e65",
  },
  secondary: {
    main: "#f50057",
  },
}

const palettesMapByRoles = {
  [Roles.ROLE_DNERHS] : {
    primary: {
      main: "#333e65",
    },
    secondary: {
      main: "#f50057",
    },
  },
  [Roles.ROLE_USER] : {
    primary: {
      main: "#1b5e20",
    },
    secondary: {
      main: "#f50057",
    },
  },
  [Roles.ROLE_RESPONSABLE_ESTABLECIMIENTO] : {
    primary: {
      main: "#bf360c",
    },
    secondary: {
      main: "#f50057",
    },
  }
}

export const getThemeByRole = (roleName) => {
 
  let palette = defaultPalette;

  if (roleName) {
    palette = palettesMapByRoles[roleName];
  }
  return createTheme({ palette });
}

export default createTheme({ palette : defaultPalette});
