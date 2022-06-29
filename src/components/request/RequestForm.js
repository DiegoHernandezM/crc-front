import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { DatePicker } from '@mui/lab';
// ----------------------------------------------------------------------

PetitionForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  petition: PropTypes.object,
  update: PropTypes.bool,
  updatePetition: PropTypes.func
};

const validationSchema = yup.object({
  comment: yup.string('Descripcion').required('Comentarios son requeridos')
});

export default function PetitionForm({ open, close, petition, update, updatePetition }) {
  const [approvedP, setApprovedP] = useState(0);
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const formik = useFormik({
    initialValues: {
      date: moment().format('YYYY-MM-DD'),
      comment: '',
      approved: '',
      petition_description: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const approve = petition.approved === 2 ? petition.approved : approvedP;
      updatePetition(petition.id, values.comment, approve);
      resetForm(formik.initialValues);
      setChecked(false);
      setDisabled(false);
      setApprovedP(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, petition]);

  const onCloseDrawer = () => {
    setChecked(false);
    setDisabled(false);
    close();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onCloseDrawer}>
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
              {update ? 'Aprobar peticion' : 'Nueva petición'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
              size="small"
            >
              {update ? 'Guardar' : 'Guardar'}
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
              // minDate={new Date(moment().subtract(1, 'days'))}
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
              label="Descripcion"
              disabled={update}
              onChange={formik.handleChange}
              value={formik.values.petition_description || ''}
              error={formik.touched.petition_description && Boolean(formik.errors.petition_description)}
              helperText={formik.touched.petition_description && formik.errors.petition_description}
              fullWidth
              size="small"
              variant="outlined"
            />
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
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <FormControlLabel
              control={
                <Switch
                  disabled={petition.approved === 2 ? true : disabled}
                  // eslint-disable-next-line no-unneeded-ternary
                  checked={petition.approved === 2 ? true : checked}
                  onChange={() => {
                    setApprovedP(2);
                    setChecked(true);
                    setDisabled(true);
                  }}
                />
              }
              label="Aprobar peticion"
            />
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
