import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogActions, DialogTitle, Typography, DialogContent, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  isLoading: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  verifyPassword: PropTypes.bool,
  error: PropTypes.bool
};

export default function ConfirmDialog({ open, close, title, body, onConfirm, verifyPassword, error, isLoading }) {
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">{body}</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '30px'
          }}
        >
          {verifyPassword === true ? (
            <form>
              <TextField
                value={password}
                error={error}
                onChange={handleChange}
                helperText={error === true ? 'Contraseña inválida' : null}
                id="filled-password-input"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
                autoFocus
              />
            </form>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton loading={isLoading} onClick={handleConfirm} variant="outlined" color="primary">
          Confirmar
        </LoadingButton>
        <Button onClick={close} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
