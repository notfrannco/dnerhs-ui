import { CssBaseline } from "@material-ui/core";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { Router, Route, Switch } from "react-router-dom";
import theme from "theme";
import history from "utils/History";
import Login from "components/Login";
import Home from "components/Home";
import Backdrop from "components/Backdrop";
import Responsable from "layout/Responsable/Form";
import DescargarCertificado from "layout/DescargarCertificado/Form";
import ConveniosVigentes from "layout/ConveniosFirmadosVigentes/List";
import UserProvider from "context/User/UserProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router history={history}>
          <CssBaseline />
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/responsable/crear" component={Responsable} />
            <Route
              path="/descargarCertificado"
              component={DescargarCertificado}
            />
            <Route
              path="/listadoConveniosVigentes"
              component={ConveniosVigentes}
            />
            <Route path="/" component={Home} />
          </Switch>
          <Backdrop />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
