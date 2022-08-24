import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AssignmentIcon from '@material-ui/icons/Assignment';
import List from "@material-ui/core/List";
import Tooltip from "@material-ui/core/Tooltip";
import BusinessIcon from "@material-ui/icons/Business";
import history from "utils/History";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonIcon from '@material-ui/icons/Person';
import useAuth from "hooks/Auth";
import Roles from "constants/Roles";

const menuOptions = [
  {
    path: "convenios",
    title: "Convenios",
    icon: <AssignmentIcon />,
    rolesRequired: [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
  },
  {
    path: "sedesSelection",
    title : "Sedes",
    icon: <BusinessIcon />,
    rolesRequired: [Roles.ROLE_USER]
  },
  {
    path: "carreras",
    title : "Carreras",
    icon: <LibraryBooksIcon />,
    rolesRequired: [Roles.ROLE_DNERHS]
  },
  {
    path: "constancias",
    title: "Constancias",
    icon: <PlaylistAddCheckIcon />,
    rolesRequired: [Roles.ROLE_USER]
  },
  {
    path: "establecimientos",
    title: "Establecimientos",
    icon: <BusinessIcon />,
    rolesRequired: [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
  },
  {
    path: "establecimientos/responsables",
    title: "Responsables Establecimientos",
    icon: <PersonIcon />,
    rolesRequired: [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
  },
  {
    path: "responsables",
    title: "Solicitud Responsables",
    icon: <AccountBoxIcon />,
    rolesRequired: [Roles.ROLE_ADMIN, Roles.ROLE_DNERHS]
  }
]

const Menu = () => {
  const { userData } = useAuth();

  const handleClickLink = (path) => {
    history.push(`/${path}`);
  };

  const filterMenuOptions = (menu) => {
    return menu.rolesRequired.length === 0 || menu.rolesRequired.includes(userData?.roleName)
  }

  return (
    <>
      <List>
        {
          menuOptions.filter(filterMenuOptions).map((menu, index) => (
            <ListItem
              key = {index}
              button
              onClick={() => handleClickLink(menu.path)}
            >
              <ListItemIcon>
                <Tooltip title={menu.title}>
                  {menu.icon}
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={menu.title} />
            </ListItem>
          ))
        }
      </List>
    </>
  );
};

export default Menu;
