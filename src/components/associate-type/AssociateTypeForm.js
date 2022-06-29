import { useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Button, Drawer, FormControl, IconButton, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

import * as yup from 'yup';
import { useFormik } from 'formik';
// ----------------------------------------------------------------------

AssociateTypeForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  associateType: PropTypes.object,
  update: PropTypes.bool,
  updateAssociateType: PropTypes.func
};

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido')
});

export default function AssociateTypeForm({ open, close, parentCallback, associateType, update, updateAssociateType }) {
  const formik = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values);
      } else {
        updateAssociateType(associateType.id, values.name);
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', update ? associateType.name : formik.initialValues.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, associateType]);

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <Box sx={{ width: { xs: '375px', md: '500px', lg: '500px', xl: '600px' } }}>
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
              {update ? 'Actualizar' : 'Nuevo'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
              size="small"
            >
              {update ? 'Actualizar Tipo de asociado' : 'Guardar Tipo de asociado'}
            </Button>
            <IconButton
              aria-label="close"
              onClick={close}
              sx={{
                color: (theme) => theme.palette.grey[500]
              }}
              style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}
            >
              <Close />
            </IconButton>
          </Box>
          <FormControl style={{ marginLeft: '10px', width: '90%' }}>
            <TextField
              id="name"
              name="name"
              label="Nombre"
              value={formik.values.name || ''}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              size="small"
            />
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
