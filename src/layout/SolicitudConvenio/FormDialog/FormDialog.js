import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";

export default function FormDialog(props) {
  const [motivoRechazo, setMotivoRechazo] = useState("");
  function handleClose() {
    props.onClose();
  }

  function onAccept() {
    props.onAccept(motivoRechazo);
  }

  return (
    <div>
      <Dialog open={props.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Solicitud de correciones
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Describa brevemente las correciones solicitadas
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            placeholder={"Motivo del rechazo"}
            fullWidth
            multiline
            variant="outlined"
            value={motivoRechazo}
            onChange={(e) => {
              setMotivoRechazo(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={onAccept}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
