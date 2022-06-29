import { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import { Box, Button, Drawer, FormControl, MenuItem, IconButton, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';

import * as yup from 'yup';
import { useFormik } from 'formik';
// ----------------------------------------------------------------------

PetitionForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  petition: PropTypes.object,
  update: PropTypes.bool,
  updatePetition: PropTypes.func
};

const TYPE = [
  { value: '', label: 'SELECCIONE' },
  { value: 'RETARDO', label: 'Retardo' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'VACACIONES', label: 'Vacaciones' },
  { value: 'PERMISO', label: 'Permiso' },
  { value: 'OTRO', label: 'Otro' }
];

const validationSchema = yup.object({
  date: yup.string('Descripcion').required('La fecha es requerida'),
  petition_description: yup.string('Descripcion').required('La descripcion es requerida'),
  comment: yup.string('Descripcion').required('Comentarios son requeridos')
});

export default function PetitionForm({ open, close, parentCallback, petition, update, updatePetition }) {
  const formik = useFormik({
    initialValues: {
      date: moment().format('YYYY-MM-DD'),
      petition_description: '',
      comment: '',
      approved: 1,
      associate_id: 0
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values);
      } else {
        updatePetition(
          petition.id,
          values.date,
          values.petition_description,
          values.comment,
          values.approved,
          values.associate_id
        );
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('date', update ? petition.date : formik.initialValues.date);
    formik.setFieldValue(
      'petition_description',
      update ? petition.petition_description : formik.initialValues.petition_description
    );
    formik.setFieldValue('comment', update ? petition.comment : formik.initialValues.comment);
    formik.setFieldValue('approved', update ? petition.approved : formik.initialValues.approved);
    formik.setFieldValue('associate_id', update ? petition.associate_id : formik.initialValues.associate_id);
    formik.setFieldValue('approved_by', update ? petition.approved_by : formik.initialValues.approved_by);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, petition]);

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <Box sx={{ width: { xs: '375px', md: '500px', xl: '600px' } }}>
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
              {update ? 'Editar' : 'Nueva'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
              size="small"
            >
              {update ? 'Actualizar Peticion' : 'Guardar'}
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
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <DatePicker
              label="Fecha de registro"
              disabled={update}
              minDate={new Date(moment().subtract(1, 'days'))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  helperText={formik.touched.date && formik.errors.date}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                />
              )}
              id="date"
              name="date"
              value={formik.values.date}
              onChange={(value) => formik.setFieldValue('date', value)}
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="petition_description"
              name="petition_description"
              label="Tipo de peticion"
              onChange={(e, value) => {
                formik.setFieldValue('petition_description', value.props.value);
              }}
              value={formik.values.petition_description || ''}
              error={formik.touched.petition_description && Boolean(formik.errors.petition_description)}
              helperText={formik.touched.petition_description && formik.errors.petition_description}
              select
              fullWidth
              size="small"
            >
              {TYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="comment"
              name="comment"
              label="Comentarios"
              onChange={formik.handleChange}
              value={formik.values.comment || ''}
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              helperText={formik.touched.comment && formik.errors.comment}
              fullWidth
              size="small"
              multiline
              rows={8}
              variant="outlined"
            />
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
