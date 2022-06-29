import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  Tooltip,
  DialogContent,
  TextField,
  DialogTitle,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

PasswordDialog.defaultProps = {
  open: false,
  password: null,
  userError: null,
  txtUserError: null,
  actionClose: null,
  actionChange: null,
  reseted: false
};

PasswordDialog.propTypes = {
  open: PropTypes.bool,
  password: PropTypes.string,
  userError: PropTypes.bool,
  txtUserError: PropTypes.string,
  actionClose: PropTypes.func,
  actionChange: PropTypes.func,
  reseted: PropTypes.bool
};

export default function PasswordDialog({
  open,
  password,
  userError,
  txtUserError,
  actionClose,
  actionChange,
  reseted
}) {
  const [openTooltip, setOpenTooltip] = useState(false);
  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      onClose={() => {
        actionClose();
      }}
    >
      {reseted ? <DialogTitle>Contraseña Restablecida</DialogTitle> : <DialogTitle>Contraseña Generada</DialogTitle>}
      <DialogContent>
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          onClose={() => {
            actionClose();
          }}
          open={openTooltip}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Texto Copiado"
        >
          <TextField
            error={!!userError}
            helperText={txtUserError}
            name="passUser"
            label="Contraseña"
            margin="normal"
            variant="outlined"
            fullWidth
            multiline
            value={password}
            onChange={actionChange}
          />
        </Tooltip>
        <DialogContent>
          <Typography color="error">
            Asegurate de guardar tu contraseña generada, ya que ésta será la única vez que el sistema la mostrará.
          </Typography>
        </DialogContent>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            // actionClose();
            navigator.clipboard.writeText(password);
            setOpenTooltip(true);
          }}
          color="primary"
        >
          Copiar Contraseña
        </Button>
        {reseted ? (
          <Button
            onClick={() => {
              actionClose();
            }}
            color="primary"
          >
            Aceptar
          </Button>
        ) : (
          <Button
            onClick={() => {
              actionClose();
            }}
            color="primary"
          >
            Siguiente
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
