import { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, Box } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import * as yup from 'yup';
import { useFormik } from 'formik';
// components
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// ----------------------------------------------------------------------

DetailAttendance.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  check: PropTypes.object,
  update: PropTypes.bool,
  parentCallback: PropTypes.func,
  updateCheck: PropTypes.func
};

const validationSchema = yup.object({
  checkin: yup.string('Entrada').required('La entrada es requerida'),
  checkout: yup.string('Salida').required('La salida es requerida'),
  comments: yup.string('Comentarios').nullable()
});

export default function DetailAttendance({ open, close, check, update, parentCallback, updateCheck }) {
  const formik = useFormik({
    initialValues: {
      checkin: '',
      checkout: '',
      comments: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values);
      } else {
        updateCheck(check.id, values);
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('checkin', update ? check.checkin : formik.initialValues.checkin);
    formik.setFieldValue('checkout', update ? check.checkout : formik.initialValues.checkout);
    formik.setFieldValue('comments', update ? check.comments : formik.initialValues.comments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, check]);

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={open} onClose={close} aria-labelledby="responsive-dialog-title">
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <DialogTitle id="responsive-dialog-title">{update ? 'Actualizar registro' : 'Nuevo Registro'}</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  mt: { xs: '70px', sm: '30px', md: '30px', lg: '20px' },
                  mb: { xs: '70px', sm: '30px', md: '35px', lg: '20px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FormControl style={{ margin: '10px', width: '40%' }}>
                  <DateTimePicker
                    label="Entrada"
                    id="checkin"
                    name="checkin"
                    maxDate={new Date()}
                    value={formik.values.checkin ? moment(formik.values.checkin) : null}
                    onChange={(value) => formik.setFieldValue('checkin', value)}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        helperText={formik.touched.checkin && formik.errors.checkin}
                        error={formik.touched.checkin && Boolean(formik.errors.checkin)}
                      />
                    )}
                  />
                </FormControl>
                <FormControl style={{ margin: '10px', width: '40%' }}>
                  <DateTimePicker
                    label="Salida"
                    id="checkout"
                    name="checkout"
                    maxDate={new Date()}
                    value={formik.values.checkout ? moment(formik.values.checkout) : null}
                    onChange={(value) => formik.setFieldValue('checkout', value)}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        helperText={formik.touched.checkout && formik.errors.checkout}
                        error={formik.touched.checkout && Boolean(formik.errors.checkout)}
                      />
                    )}
                  />
                </FormControl>
              </Box>
              <FormControl
                style={{
                  display: update ? 'block' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TextField
                  id="comments"
                  label="Comentarios"
                  multiline
                  fullWidth
                  rows={4}
                  onChange={formik.handleChange}
                  value={formik.values.comments || ''}
                  helperText={formik.touched.comments && formik.errors.comments}
                  error={formik.touched.comments && Boolean(formik.errors.comments)}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={close}>
                Cerrar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogActions>
          </form>
        </LocalizationProvider>
      </Dialog>
    </>
  );
}
