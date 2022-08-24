import React from "react";
import Grid from "@material-ui/core/Grid";
import { Switch, Route } from "react-router-dom";
import useAuth from "hooks/Auth";
import Routes from "config/Routes"
import NoMatchPage from "./NoMatchPage";

const Content = () => {

  const { userData } = useAuth();

    return (
        <>
          <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={12}>
                  <Switch>
                    {Routes.filter((route) => {
                      return (
                        route.rolesRequired.length === 0 ||
                        route.rolesRequired.includes(userData?.roleName)
                      );
                    }).map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        exact
                        component={route.component}
                      />
                    ))}
                    <Route component={NoMatchPage} />
                  </Switch>
                </Grid>
              </Grid>
        </>
    )
}

export default Content;