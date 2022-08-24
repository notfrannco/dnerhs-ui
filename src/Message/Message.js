import React from 'react';
import { Grid, Typography, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  warningContainer: {
    padding: '6%',
  },
}));

const Message = props => {
  const classes = useStyles();
  return (
    <Grid className={classes.warningContainer}>
      <Typography variant="h5" gutterBottom>
        <Box textAlign="center" m={1}>
          {props.title}
        </Box>
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <Box textAlign="center" m={1}>
          {props.message}
        </Box>
      </Typography>
    </Grid>
  );
};

export default Message;
