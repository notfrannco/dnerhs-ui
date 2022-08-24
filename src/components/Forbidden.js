import React from "react";
import {
    Grid
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


const Forbidden = () => {
    return (
        <>
            <Grid container  direction="column" alignContent="center" justifyContent="center">
                <Grid item>
                    <Typography align="center" variant="h4" color="primary">
                        No posee permisos para acceder al recurso.
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
};

export default Forbidden