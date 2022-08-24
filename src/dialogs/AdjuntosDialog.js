import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import ReactDropzone from "react-dropzone";
import DnerhsApi from "../api/DnerhsApi";
import Alert from "../components/Alert";
import { CircularProgress, Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  styleItem: {
    height: "100%",
    width: "100%",
    overflow: "auto",
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const DialogTitle = ((props) => {
  const classes = useStyles();
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>

      <Box display="flex" alignItems="center">
        <Box flexGrow={1} > <Typography variant="h6" color="primary">{children}</Typography></Box>
        {onClose ? (
          <Box>
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        ) : null}

      </Box>
    </MuiDialogTitle>
  );
});

export default function AdjuntoDialog(props) {
  const classes = useStyles();
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const onDrop = (selectedFile) => {
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("file", file[0]);
      formData.append("filename", file[0].name);
      const response = await DnerhsApi({
        method: "post",
        url: `/file`,
        timeout: 120000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
        data: formData,
      });

      Alert.show(
        {
          message: "Archivo subido exitosamente.",
          type: "success"
        }
      )
      handleClose({
        docId : response.data.id
      });
    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.showServerError(error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleClose = ({docId}) => {
    setFile([]);
    setSaved(false);
    props.onClose(docId);
  };
  const handleCancelBtnClick = () => {
    setFile([]);
  };

  return (

    <Dialog
      open={props.open}
      fullWidth={true}
      maxWidth="md"
      onClose={handleClose}
    >
      <DialogTitle onClose={handleClose}>
        {`Adjuntos - ${props.tipoDoc}`}
      </DialogTitle> 
     

      <DialogContent>
        <Grid item xs={12} className={classes.styleItem}>
          <Grid container direction="column">
            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : !saved ? (
                    <ReactDropzone onDrop={onDrop}>
                      {({ acceptedFiles, getRootProps, getInputProps }) => (
                        <section>
                          <div
                            {...getRootProps()}
                            style={{
                              minHeight: "100px",
                              margin: "16px",
                              borderRadius: "5px",
                              border: "1px solid black",
                            }}
                          >
                            <input {...getInputProps()} />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {acceptedFiles.length === 0 ||
                                file.length === 0 ? (
                                <p>
                                  Arrastre archivos aquí, o haga click para
                                  seleccionar alguno
                                </p>
                              ) : (
                                <p>{acceptedFiles[0].name}</p>
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                    </ReactDropzone>
                  ) : (
                    <Typography>Proceso finalizado</Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelBtnClick} disabled={file.length === 0 || saved} color="default">
          Cancelar
        </Button>
        <Button onClick={uploadFile} color="primary" disabled={file.length === 0 || loading || saved} autoFocus>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>

  );
}
