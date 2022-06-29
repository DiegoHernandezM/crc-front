import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Button, Drawer, FormControl, TextField, Typography, MenuItem } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
// ----------------------------------------------------------------------
import moment from 'moment';

UserForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  user: PropTypes.object,
  update: PropTypes.bool,
  updateUser: PropTypes.func,
  areas: PropTypes.array,
  authorities: PropTypes.array,
  roles: PropTypes.array
};

const validationSchema = yup.object({
  first_name: yup.string('Nombre').required('El nombre es requerido'),
  email: yup.string('Email').required('El email es requerido'),
  area: yup.string('Area').required('El area es requerida'),
  role: yup.string('Rol').required('El rol es requerido')
});

const stateInit = {
  enabled: true,
  accountNonExpired: false,
  credentialsNonExpired: false,
  accountNonLocked: false
};

export default function UserForm({ open, close, parentCallback, user, update, updateUser, authorities, areas, roles }) {
  const [state, setState] = useState(stateInit);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      accountExpirationDate: '',
      credentialsExpirationDate: '',
      area: '',
      role: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values);
      } else {
        updateUser(user.id, values);
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    if (!update) {
      setPassword(generatePassword(16));
      formik.setFieldValue('first_name', '');
      formik.setFieldValue('last_name', '');
      formik.setFieldValue('email', '');
      formik.setFieldValue('permissions', []);
    } else {
      formik.setFieldValue('first_name', update ? user.first_name : formik.initialValues.first_name);
      formik.setFieldValue('email', update ? user.email : formik.initialValues.email);
      formik.setFieldValue('last_name', update ? user.last_name : formik.initialValues.last_name);
      formik.setFieldValue('area', update ? user.area_id : formik.initialValues.area);
      formik.setFieldValue('role', user.roles?.length > 0 ? user.roles[0].id : formik.initialValues.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, user, authorities]);

  useEffect(() => {
    formik.setFieldValue('area', areas[0] ? areas[0].id : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  useEffect(() => {
    formik.setFieldValue('role', roles[0] ? roles[0].id : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  const isValidEmail = (email) => {
    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  };

  const handleChange = (event) => {
    const userValidEmail = {
      nameError: false,
      userNameErrorMessage: ''
    };
    if (
      event.target.name === 'enabled' ||
      event.target.name === 'accountNonExpired' ||
      event.target.name === 'accountNonLocked' ||
      event.target.name === 'credentialsNonExpired'
    ) {
      let value = event.target.checked;
      if (
        event.target.name === 'accountNonExpired' ||
        event.target.name === 'accountNonLocked' ||
        event.target.name === 'credentialsNonExpired'
      ) {
        value = !value;
      }
      setState({ ...state, [event.target.name]: value });
    } else if (event.target.name === 'email') {
      if (event.target.value.length === 0) {
        userValidEmail.nameError = false;
        userValidEmail.userNameErrorMessage = '';
      } else if (isValidEmail(event.target.value)) {
        userValidEmail.nameError = false;
        userValidEmail.userNameErrorMessage = '';
      } else {
        userValidEmail.nameError = true;
        userValidEmail.userNameErrorMessage = 'Ingrese un correo electrónico válido';
      }
      setError(userValidEmail.nameError);
      setErrorMessage(userValidEmail.userNameErrorMessage);
    }
  };

  const generatePassword = (long) => {
    const characters = 'abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ123467890';
    let password = '';
    for (let i = 0; i < long; i += 1) password += characters.charAt(Math.floor(Math.random() * characters.length));
    return password;
  };

  const closeDrawer = () => {
    if (update) {
      setError(false);
      setErrorMessage('');
      close();
    } else {
      formik.setFieldValue('first_name', '');
      formik.setFieldValue('email', '');
      formik.setFieldValue('last_name', '');
      formik.setFieldValue('area', '');
      formik.setFieldValue('role', '');
      setError(false);
      setErrorMessage('');
      close();
    }
  };

  return (
    <Box>
      <Drawer anchor="right" open={open} onClose={closeDrawer} style={{ width: '500px' }}>
        <Box style={{ width: '500px' }}>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h4" style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
                {update ? 'Actualizar Administrador' : 'Nuevo Administrador'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
                size="small"
                onClick={() => {
                  if (!update) {
                    formik.setFieldValue('password', password);
                    formik.setFieldValue('accountExpirationDate', moment().add(1, 'M').startOf('day'));
                    formik.setFieldValue('credentialsExpirationDate', moment().add(1, 'M').startOf('day'));
                  }
                }}
              >
                {update ? 'Actualizar Usuario' : 'Guardar Usuario'}
              </Button>
            </Box>
            <FormControl style={{ marginLeft: '10px', width: '90%' }}>
              <TextField
                id="email"
                name="email"
                label="Email"
                value={formik.values.email || ''}
                onChange={formik.handleChange}
                error={error || (formik.touched.email && Boolean(formik.errors.email))}
                fullWidth
                helperText={errorMessage || (formik.touched.email && formik.errors.email)}
                size="small"
                onChangeCapture={handleChange}
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="first_name"
                name="first_name"
                label="Nombre(s)"
                value={formik.values.first_name || ''}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                fullWidth
                helperText={formik.touched.first_name && formik.errors.first_name}
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="last_name"
                name="last_name"
                label="Apellidos"
                value={formik.values.last_name || ''}
                onChange={formik.handleChange}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                fullWidth
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="area"
                name="area"
                label="Area"
                onChange={formik.handleChange}
                value={formik.values.area || ''}
                select
                error={formik.touched.area && Boolean(formik.errors.area)}
                fullWidth
                helperText={formik.touched.area && formik.errors.area}
                size="small"
              >
                {areas.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="role"
                name="role"
                label="Rol"
                onChange={formik.handleChange}
                value={formik.values.role || ''}
                select
                error={formik.touched.role && Boolean(formik.errors.role)}
                fullWidth
                helperText={formik.touched.role && formik.errors.role}
                size="small"
              >
                {roles.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </form>
        </Box>
      </Drawer>
    </Box>
  );
}
