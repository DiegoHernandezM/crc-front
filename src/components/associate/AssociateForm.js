import { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material

import {
  Box,
  Button,
  Drawer,
  FormControl,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  FormControlLabel,
  Switch
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import { Close } from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useDispatch, useSelector } from '../../redux/store';
import { findEmployee, onFindEmployee } from '../../redux/slices/associate';
// -----------------------------------------------------------------------

AssociateForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallbackAssociate: PropTypes.any,
  parentCallbackManager: PropTypes.any,
  associate: PropTypes.object,
  update: PropTypes.bool,
  updateRegister: PropTypes.func,
  areas: PropTypes.array,
  subareas: PropTypes.array,
  onChangeArea: PropTypes.func
};

export default function AssociateForm({
  open,
  close,
  parentCallbackAssociate,
  associate,
  update,
  updateRegister,
  areas,
  subareas,
  onChangeArea
}) {
  const dispatch = useDispatch();
  const { employeeNumberAvailable, errorMessage } = useSelector((state) => state.associate);
  const validationSchema = yup.object({
    name: yup
      .string('Nombre')
      .required('El nombre es requerido')
      .matches(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
        'Sólo letras del alfabeto'
      ),
    employee: yup.number('No. Empleado').required('El número de empleado es requerido'),
    entry: yup.string('Fecha de ingreso').when('type', {
      is: (value) => value !== 'manager',
      then: (s) => s.required('La fecha de ingreso es requerida')
    }),
    subarea: yup.number('Subarea').required('Subarea es requerida'),
    area: yup.number('Area').required('Area es requerida'),
    unionized: yup.bool('Sindicalizado')
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      employee: '',
      entry: moment().format('YYYY-MM-DD'),
      subarea: '',
      area: '',
      subareas: '',
      saalmauser: '',
      wamasuser: '',
      unionized: 0
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallbackAssociate(values);
      } else {
        updateRegister(associate.id, values);
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', associate.name ?? formik.initialValues.name);
    formik.setFieldValue('employee', associate.employee_number ?? formik.initialValues.employee);
    formik.setFieldValue('entry', associate.entry_date ?? formik.initialValues.entry);
    formik.setFieldValue('area', associate.area_id ?? formik.initialValues.area);
    formik.setFieldValue('subarea', associate.subarea_id ?? formik.initialValues.subarea);
    formik.setFieldValue('saalmauser', associate.saalmauser ?? formik.initialValues.saalmauser);
    formik.setFieldValue('wamasuser', associate.wamasuser ?? formik.initialValues.wamasuser);
    formik.setFieldValue('unionized', associate.unionized ?? formik.initialValues.unionized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, associate]);

  useEffect(() => {
    formik.setFieldValue('area', areas[0] ? areas[0].id : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <Box sx={{ width: { xs: '100%', md: '500px', xl: '600px' } }}>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
                padding: '10px'
              }}
            >
              <Typography variant="h4" style={{ marginTop: '10px', marginBottom: '30px' }}>
                {update ? 'Actualizar colaborador' : 'Nuevo colaborador'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{
                  borderRadius: 30,
                  height: '30px',
                  marginTop: '10px',
                  marginLeft: '10px',
                  marginBottom: '30px'
                }}
                size="small"
              >
                {update ? 'Actualizar' : 'Guardar'}
              </Button>
              <IconButton
                aria-label="close"
                onClick={close}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
                style={{ marginTop: '10px', marginBottom: '30px' }}
              >
                <Close />
              </IconButton>
            </Box>
            <FormControl style={{ width: '100%', padding: '10px' }}>
              <TextField
                id="name"
                name="name"
                label="Nombre completo"
                value={formik.values.name || ''}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </FormControl>
            <FormControl style={{ width: '100%', padding: '10px' }}>
              <TextField
                id="employee"
                name="employee"
                label="No. de empleado"
                value={formik.values.employee || ''}
                onChange={formik.handleChange}
                onBlur={() => {
                  if (!update) {
                    dispatch(findEmployee(formik.values.employee));
                  } else if (update && associate?.employee_number !== parseInt(formik.values.employee, 10)) {
                    dispatch(findEmployee(formik.values.employee));
                  } else if (associate?.employee_number === parseInt(formik.values.employee, 10)) {
                    dispatch(onFindEmployee({ payload: { success: true, message: '' } }));
                  }
                }}
                error={!employeeNumberAvailable}
                fullWidth
                helperText={errorMessage}
                size="small"
              />
            </FormControl>
            <FormControl style={{ width: '100%', padding: '10px' }}>
              <DatePicker
                label="Fecha de ingreso"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    helperText={formik.touched.entry && formik.errors.entry}
                    error={formik.touched.entry && Boolean(formik.errors.entry)}
                  />
                )}
                id="entry"
                name="entry"
                value={formik.values.entry}
                onChange={(value) => formik.setFieldValue('entry', value)}
              />
            </FormControl>
            <FormControl style={{ width: '100%', padding: '10px' }}>
              <TextField
                id="area"
                name="area"
                label="Area"
                onChange={(e, value) => {
                  formik.setFieldValue('area', value.props.value);
                  onChangeArea(value.props.value);
                }}
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
            <FormControl style={{ width: '100%', padding: '10px' }}>
              <TextField
                id="subarea"
                name="subarea"
                label="Subarea"
                onChange={(e, value) => {
                  formik.setFieldValue('subarea', value.props.value);
                }}
                value={formik.values.subarea || ''}
                select
                error={formik.touched.subarea && Boolean(formik.errors.subarea)}
                fullWidth
                helperText={formik.touched.subarea && formik.errors.subarea}
                size="small"
              >
                <MenuItem key={'id-subarea'} value="">
                  SELECCIONE
                </MenuItem>
                {subareas.map((option) => (
                  <MenuItem key={option.id} value={`${option.id}`}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl style={{ width: '100%', padding: '10px' }}>
              <TextField
                id="saalmauser"
                name="saalmauser"
                label="Usuario de SAALMA"
                value={formik.values.saalmauser || ''}
                style={{ display: formik.values.area !== 1 ? 'none' : 'flex' }}
                disabled={formik.values.area !== 1}
                onChange={formik.handleChange}
                error={formik.touched.saalmauser && Boolean(formik.errors.saalmauser)}
                fullWidth
                helperText={formik.touched.saalmauser && formik.errors.saalmauser}
                size="small"
              />
            </FormControl>
            <FormControl style={{ width: '100%', padding: '10px' }}>
              <TextField
                id="wamasuser"
                name="wamasuser"
                label="Usuario de WAMAS"
                value={formik.values.wamasuser || ''}
                style={{ display: formik.values.area !== 2 ? 'none' : 'flex' }}
                disabled={formik.values.area !== 2}
                onChange={formik.handleChange}
                error={formik.touched.wamasuser && Boolean(formik.errors.wamasuser)}
                fullWidth
                helperText={formik.touched.wamasuser && formik.errors.wamasuser}
                size="small"
              />
            </FormControl>
            <FormControl component="fieldset" variant="standard" style={{ width: '100%', padding: '10px' }}>
              <FormControlLabel
                control={
                  <Switch
                    value={formik.values.unionized === 1}
                    onChange={formik.handleChange}
                    name="unionized"
                    id="unionized"
                  />
                }
                label="Sindicalizado"
              />
            </FormControl>
          </form>
        </Box>
      </LocalizationProvider>
    </Drawer>
  );
}
