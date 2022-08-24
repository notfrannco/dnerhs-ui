import React from "react";
import {
    Grid
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


const NoMatchPage = () => {
    return (
        <>
            <Grid container  direction="column" alignContent="center" justifyContent="center">
                <Grid item>
                    <Typography align="center" variant="h4" color="primary">
                        No se encontró el recurso solicitado.
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
};

export default NoMatchPage