import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import useAuth from "../hooks/Auth";
import Footer from "./Footer";
import Header from "components/Header";
import Content from "components/Content";
import {getTheme, getThemeByRole} from "theme";
import { ThemeProvider } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  }
}));

export default function Home() {
  const classes = useStyles();
  const { userData } = useAuth();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme={getThemeByRole(userData?.roleName)}>
      <Header />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {userData &&
          <Container maxWidth="lg" className={classes.container}>
            <Content />
            <Box pt={4}>
              <Footer />
            </Box>
          </Container>
        }
      </main>
      </ThemeProvider>
    </div>
  );
}



