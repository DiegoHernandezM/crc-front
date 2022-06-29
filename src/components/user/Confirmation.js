import React from 'react';
import PropTypes from 'prop-types';
import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography } from '@mui/material';

Confirmation.defaultProps = {
  title: 'Restaurar Contraseña',
  hideDialog: null,
  open: false,
  message: '¿Esta seguro de restablecer la contraseña del usuario seleccionado?'
};

Confirmation.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  open: PropTypes.bool,
  hideDialog: PropTypes.func,
  changeOk: PropTypes.func.isRequired,
  changeCancel: PropTypes.func.isRequired
};

export default function Confirmation({ title, message, open, hideDialog, changeOk, changeCancel }) {
  return (
    <Box>
      <Dialog
        // disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={() => {
          hideDialog(false);
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography color="error">{message}</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              changeCancel();
            }}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              changeOk();
            }}
            color="primary"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
