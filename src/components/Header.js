import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuDNERHS from "./Menu";
import useAuth from "../hooks/Auth";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Chip from '@material-ui/core/Chip';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { getRoleDescription } from "../constants/Roles";
import history from "utils/History"
import DnerhsApi from "api/DnerhsApi";

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9),
        },
    },
    menuButtonHidden: {
        display: "none",
    },
    menuButton: {
        marginRight: 36,
        // marginRight: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    }
}));

const Header = () => {
    const [establecimiento, setEstablecimiento] = useState("establecimiento");
    const [institucion, setInstitucion] = useState("establecimiento");    
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { userData, logout, canShowMenu } = useAuth();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenuAppBar = Boolean(anchorEl);

    const handleCambiarPassword = () => {
        handleCloseMenuAppBar();
        history.push("/cambioPass");
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenuAppBar = () => {
        setAnchorEl(null);
    };
    const getEstablecimiento = async () => {
        if(userData?.role?.descripcion==="ROLE_RESPONSABLE_ESTABLECIMIENTO"){
            const { data } = await DnerhsApi.get("/instituciones/establecimientos/responsables/info");
            let nombreEstablecimiento=data?.nombreServicio?.nombre;
            setEstablecimiento(nombreEstablecimiento?nombreEstablecimiento:null);
        }
    };
    const getInstitucion = async () => {
        if(userData?.role?.descripcion==="ROLE_USER"){
            const { data } = await DnerhsApi.get(
                `/usuarios/${userData.userId}`
            ); 
            let nombreInstitucion=data?.institucionFormadoraResponsableMaximaAutoridadList[0]?.formadora?.institucion;     
            setInstitucion(nombreInstitucion);
        }
    };
    useEffect(() => {
        setShowMenu(canShowMenu);
        getEstablecimiento();
        getInstitucion();
    }, [canShowMenu, userData])
    

    const handleDrawerOpen = () => {
        setOpen(true);
    };
  
    const handleDrawerClose = () => {
        setOpen(false);
    };

    
    return (
        <>
            <AppBar
                position="absolute"
                className={clsx(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar className={classes.toolbar}>
                    {showMenu && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(
                                classes.menuButton,
                                open && classes.menuButtonHidden
                            )}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography component="h1" variant="h6" className={classes.title}>


                        {(userData?.role?.descripcion==="ROLE_RESPONSABLE_ESTABLECIMIENTO")?"DNERHS - " + getRoleDescription(userData?.role) + " - " + establecimiento:
                        (userData?.role?.descripcion==="ROLE_USER"?
                        "DNERHS - " + getRoleDescription(userData?.role) + " - " + institucion :
                        "DNERHS - "+ getRoleDescription(userData?.role))
                        }
                        
                    </Typography>
                    {
                        userData &&
                        <>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={openMenuAppBar}
                                onClose={handleCloseMenuAppBar}
                            >
                                <Box padding={2}>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <Chip
                                                icon={<AssignmentIndIcon />}
                                                variant="outlined"
                                                label={userData?.username}
                                                color="primary"
                                            />
                                        </Grid>

                                    </Grid>

                                </Box>
                                <MenuItem onClick={handleCambiarPassword}>Cambiar Contraseña</MenuItem>
                                <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </>
                    }
                </Toolbar>
            </AppBar>
            {
                showMenu && (
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: clsx(
                                classes.drawerPaper,
                                !open && classes.drawerPaperClose
                            ),
                        }}
                        open={open}
                    >
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        {/*<List component="nav">{MenuListItems}</List>*/}
                        {<MenuDNERHS />}
                        {/* <Divider />
<List>{secondaryListItems}</List> */}
                    </Drawer>
                )
            }
        </>
    )
}

export default Header;