import * as yup from 'yup';
import esLocale from 'date-fns/locale/es';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Button, TextField, FormControl } from '@mui/material';
// ----------------------------------------------------------------------

const filters = {
  '& > *': {
    margin: '100px',
    padding: '10px 20px',
    width: '100%'
  }
};

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const validationSchema = yup.object({
  init: yup.date().nullable(),
  end: yup.date().nullable()
});

// ----------------------------------------------------------------------

Filters.propTypes = {
  parentCallback: PropTypes.any
};

export default function Filters({ parentCallback }) {
  const formik = useFormik({
    initialValues: {
      init: new Date(),
      end: new Date()
    },
    validationSchema,
    onSubmit: (values) => {
      parentCallback(values);
    }
  });

  return (
    <RootStyle>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <form
          className={filters}
          style={{ textAlign: 'center' }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <FormControl style={{ margin: '10px', width: '180px' }}>
            <DatePicker
              label="Inicio"
              renderInput={(params) => <TextField size="small" {...params} />}
              id="init"
              name="init"
              value={formik.values.init}
              onChange={(value) => formik.setFieldValue('init', value)}
              helperText={formik.touched.init && formik.errors.init}
            />
          </FormControl>
          <FormControl style={{ margin: '10px', width: '180px' }}>
            <DatePicker
              label="Fin"
              renderInput={(params) => <TextField size="small" {...params} />}
              id="end"
              name="end"
              value={formik.values.end}
              onChange={(value) => formik.setFieldValue('end', value)}
              helperText={formik.touched.end && formik.errors.end}
            />
          </FormControl>
          <br />
          <FormControl style={{ margin: '10px' }}>
            <Button variant="contained" type="submit" color="primary">
              Filtrar
            </Button>
          </FormControl>
        </form>
      </LocalizationProvider>
    </RootStyle>
  );
}
