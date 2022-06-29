import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import {
  Box,
  Button,
  Drawer,
  FormControl,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper
} from '@mui/material';

import { Close } from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TimePicker } from '@mui/lab';
import moment from 'moment';
// ----------------------------------------------------------------------

ShiftForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  areas: PropTypes.array,
  shift: PropTypes.object,
  update: PropTypes.bool,
  updateShift: PropTypes.func
};

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido'),
  areaId: yup.string('Area').required('El area es requerida')
});

const DAYS_OF_WEEK = [
  { day: 'Lunes', dayNumber: 1 },
  { day: 'Martes', dayNumber: 2 },
  { day: 'Miercoles', dayNumber: 3 },
  { day: 'Jueves', dayNumber: 4 },
  { day: 'Viernes', dayNumber: 5 },
  { day: 'Sabado', dayNumber: 6 },
  { day: 'Domingo', dayNumber: 7 }
];

const defaultState = [
  { id: 0, day: '', checkin: '', checkin_format: '', checkout: '', checkout_format: '' },
  { id: 1, day: '', checkin: '', checkin_format: '', checkout: '', checkout_format: '' },
  { id: 2, day: '', checkin: '', checkin_format: '', checkout: '', checkout_format: '' },
  { id: 3, day: '', checkin: '', checkin_format: '', checkout: '', checkout_format: '' },
  { id: 4, day: '', checkin: '', checkin_format: '', checkout: '', checkout_format: '' },
  { id: 5, day: '', checkin: '', checkin_format: '', checkout: '', checkout_format: '' },
  { id: 6, day: '', checkin: '', checkin_format: '', checkout: '', checkout_format: '' }
];
export default function ShiftForm({ open, close, parentCallback, areas, shift, update, updateShift }) {
  const [arrayShifts, setArrayShifts] = useState(defaultState);
  const formik = useFormik({
    initialValues: {
      name: '',
      areaId: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values, arrayShifts);
      } else {
        updateShift(shift.id, values.name, arrayShifts, values.areaId);
      }
      setArrayShifts([]);
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', update ? shift.name : formik.initialValues.name);
    formik.setFieldValue('areaId', update ? shift.area_id : formik.initialValues.areaId);
    if (update && shift.shifts !== undefined) {
      setArrayShifts(update && shift.shifts !== undefined ? shift.shifts : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, shift]);

  const handleChange = (index, day, time, type, typeFormat) => {
    if (arrayShifts.findIndex((x) => x.id === index) !== -1) {
      const objIndex = arrayShifts.findIndex((obj) => obj.id === index);
      const updateItem = {
        ...arrayShifts[index],
        day,
        [type]: time !== null ? moment(time).format('HH:mm:ss') : '',
        [typeFormat]: time !== null ? time : ''
      };
      const newArray = [...arrayShifts];
      newArray[objIndex] = updateItem;
      setArrayShifts(newArray);
    }
  };

  const handleOnClose = () => {
    close();
    setArrayShifts([]);
  };

  // eslint-disable-next-line consistent-return
  function printContent() {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dias</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>Salida</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DAYS_OF_WEEK.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.day}
                </TableCell>
                <TableCell component="th" scope="row">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      id={`checkin-${index}`}
                      name={`checkin-${index}`}
                      label="Entrada"
                      value={arrayShifts[index]?.checkin_format || ''}
                      onChange={(e) => handleChange(index, row.dayNumber, e, 'checkin', 'checkin_format')}
                      renderInput={(params) => <TextField {...params} fullWidth error={false} />}
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell component="th" scope="row">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      id="checkout"
                      name="checkout"
                      label="Salida"
                      value={arrayShifts[index]?.checkout_format || ''}
                      onChange={(e) => handleChange(index, row.dayNumber, e, 'checkout', 'checkout_format')}
                      renderInput={(params) => <TextField {...params} fullWidth error={false} />}
                    />
                  </LocalizationProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Drawer anchor="right" open={open} onClose={handleOnClose}>
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
              {update ? 'Actualizar' : 'Nuevo horario'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
              size="small"
            >
              {update ? 'Actualizar horario' : 'Guardar horario'}
            </Button>
            <IconButton
              aria-label="close"
              onClick={handleOnClose}
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
          <FormControl style={{ marginLeft: '10px', width: '90%', marginTop: '8px' }}>
            <TextField
              id="areaId"
              name="areaId"
              label="Area"
              onChange={formik.handleChange}
              value={formik.values.areaId || ''}
              select
              error={formik.touched.areaId && Boolean(formik.errors.areaId)}
              fullWidth
              helperText={formik.touched.areaId && formik.errors.areaId}
              size="small"
            >
              {areas.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl style={{ marginLeft: '10px', width: '90%', marginTop: '8px' }}>{printContent()}</FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
