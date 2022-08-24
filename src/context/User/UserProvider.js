import React, { useEffect, useState } from "react";
import UserContext from "context/User/UserContext";
import { getUserPrincipal, logout as logoutService } from "services/AuthService";
import {getSedeSeleccionada} from "services/UsuarioService"
import Roles from "constants/Roles";

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const [canShowMenu, setCanShowMenu] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        refreshUserProfile();
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const refreshUserProfile = () => {
    const userPrincipal = getUserPrincipal();
    if (userPrincipal) {
      setUserData(userPrincipal);
      checkCanShowMenu(userPrincipal);
    } else {
      logout();
    }
  };

  const checkCanShowMenu = (userPrincipal) => {
    if (Roles.ROLE_USER === userPrincipal?.roleName) {
      const datosInsitucion = getSedeSeleccionada();
      setCanShowMenu(datosInsitucion ? true : false);
      //userPrincipal.sede = datosInsitucion?.formadora?.institucion;
    } else {
      setCanShowMenu(Roles.ROLE_DNERHS === userPrincipal?.roleName);
    }
  }

  const hasRole = (roleName) => {
    return roleName === userData?.roleName;
  }

  const hasAnyRole = (roles) => {
    return roles.includes(userData?.roleName)
  }

  const logout = () => {
    setCanShowMenu(false);
    setUserData();
    logoutService();
  }


  return <UserContext.Provider value={{
    userData,
    refreshUserProfile,
    logout,
    canShowMenu,
    hasRole,
    hasAnyRole
  }}>{children}</UserContext.Provider>;
};

export default UserProvider;
