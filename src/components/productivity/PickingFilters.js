import * as yup from 'yup';
import esLocale from 'date-fns/locale/es';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { DatePicker, PickersDay } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfWeek from 'date-fns/startOfWeek';
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
  dateInit: yup.date().nullable(),
  dateEnd: yup.date().nullable(),
  project: yup.number().nullable()
});

// ----------------------------------------------------------------------

PickingFilters.propTypes = {
  parentCallback: PropTypes.any
};

export default function PickingFilters({ parentCallback }) {
  const formik = useFormik({
    initialValues: {
      dateInit: startOfWeek(new Date(), { weekStartsOn: 3 }),
      dateEnd: endOfWeek(new Date(), { weekStartsOn: 3 })
    },
    validationSchema,
    onSubmit: (values) => {
      parentCallback(values);
    }
  });

  const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay'
  })(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
    ...(dayIsBetween && {
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark
      }
    }),
    ...(isFirstDay && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%'
    }),
    ...(isLastDay && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%'
    })
  }));

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!formik.values.dateInit) {
      return <PickersDay {...pickersDayProps} />;
    }

    const start = startOfWeek(formik.values.dateInit, { weekStartsOn: 3 });
    const end = endOfWeek(formik.values.dateEnd, { weekStartsOn: 3 });

    const dayIsBetween = isWithinInterval(date, { start, end });
    const isFirstDay = isSameDay(date, start);
    const isLastDay = isSameDay(date, end);

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <RootStyle>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <form
          className={filters}
          style={{ textAlign: 'center' }}
          sx={{
            margin: { xs: '70px', md: '15px', lg: '10px' },
            mt: { xs: '70px', sm: '70px', md: '30px', lg: '10px' },
            mb: { xs: '50px', md: '15px', lg: '10px' }
          }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <FormControl style={{ margin: '10px' }}>
            <DatePicker
              label="Semana"
              id="init"
              name="init"
              value={formik.values.dateInit}
              onChange={(value) => {
                formik.setFieldValue('dateInit', startOfWeek(value, { weekStartsOn: 3 }));
                formik.setFieldValue('dateEnd', endOfWeek(value, { weekStartsOn: 3 }));
              }}
              renderDay={renderWeekPickerDay}
              renderInput={(params) => <TextField size="small" {...params} />}
              inputFormat="'Semana del' d 'de' MMMM"
              disableMaskedInput
            />
          </FormControl>
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
