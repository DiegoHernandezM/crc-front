import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Container, Card, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAttendances, getHistoricCsv, getAssociateCsv } from '../../redux/slices/attendance';
import { create, update } from '../../redux/slices/checkin';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import SnackAlert from '../../components/general/SnackAlert';
import TableAttendances from '../../components/attendance/TableAttendances';
import Filters from '../../components/attendance/Filters';
import DetailAttendance from '../../components/attendance/DetailAttendance';
import ConfirmDialog from '../../components/general/ConfirmDialog';

export default function Associate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { attendances, isLoading } = useSelector((state) => state.attendance);
  const [openDetail, setOpenDetail] = useState(false);
  const [associate, setAssociate] = useState({});
  const [init, setInit] = useState(moment().format('YYYY-MM-DD'));
  const [end, setEnd] = useState(moment().format('YYYY-MM-DD'));
  const [type, setType] = useState('success');
  const [message, setMessage] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [idCheck, setIdCheck] = useState(0);
  const [valuesCheck, setValuesCheck] = useState({});

  useEffect(() => {
    dispatch(getAttendances(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')));
  }, [dispatch]);

  const closeSnack = () => {
    setOpenSnack(false);
  };

  const doubleClick = (values) => {
    setAssociate(values);
    setOpenDetail(true);
  };

  const closeDetail = () => {
    setOpenDetail(false);
  };

  const handleCallback = (values) => {
    setInit(moment(values.init).format('YYYY-MM-DD'));
    setEnd(moment(values.end).format('YYYY-MM-DD'));
    dispatch(getAttendances(moment(values.init).format('YYYY-MM-DD'), moment(values.end).format('YYYY-MM-DD')));
  };

  const downloadHistoric = () => {
    dispatch(getHistoricCsv(init, end))
      .then((response) => {
        const contentType = response.headers['content-type'];
        const filename = 'reporte-asistencias.xlsx';
        const file = new Blob([response.data], { type: contentType });
        if ('msSaveOrOpenBlob' in window.navigator) {
          window.navigator.msSaveOrOpenBlob(file, filename);
        } else {
          const data = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.style = 'display: none';
          a.href = data;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(data);
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createCheckin = (id, values) => {
    dispatch(
      create(
        id,
        moment(values.checkin).format('YYYY-MM-DD HH:mm:ss'),
        moment(values.checkout).format('YYYY-MM-DD HH:mm:ss')
      )
    )
      .then((response) => {
        if (response.status === 200) {
          dispatch(getAttendances(init, end));
          setType('success');
          setMessage('Registro creado');
          setOpenDetail(false);
          setOpenSnack(true);
        }
      })
      .catch((error) => {
        setOpenDetail(false);
        setType('error');
        setMessage(error.message);
        setOpenSnack(true);
      });
  };

  const updateCheckin = (id, values) => {
    setIdCheck(id);
    setValuesCheck(values);
    setOpenConfirmDialog(true);
  };

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const downloadAssociate = () => {
    dispatch(getAssociateCsv(associate.id, init, end))
      .then((response) => {
        const contentType = response.headers['content-type'];
        const filename = `${associate.employee_number}-asistencias.xlsx`;
        const file = new Blob([response.data], { type: contentType });
        if ('msSaveOrOpenBlob' in window.navigator) {
          window.navigator.msSaveOrOpenBlob(file, filename);
        } else {
          const data = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.style = 'display: none';
          a.href = data;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(data);
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleConfirm = (password) => {
    dispatch(
      update(
        idCheck,
        moment(valuesCheck.checkin).format('YYYY-MM-DD HH:mm:ss'),
        moment(valuesCheck.checkout).format('YYYY-MM-DD HH:mm:ss'),
        valuesCheck.comments,
        password
      )
    )
      .then((response) => {
        if (response.status === 200) {
          dispatch(getAttendances(init, end));
          if (response.data.status === false) {
            setErrorPassword(true);
          } else {
            setOpenConfirmDialog(false);
            setType('success');
            setMessage('Registro actualizado');
            setOpenDetail(false);
            setOpenSnack(true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Page title="Asistencias">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Asistencias" links={[{ name: '', href: PATH_DASHBOARD.root }]} action={null} />
      </Container>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <Box
            sx={{
              mt: { xs: '70px', sm: '30px', md: '30px', lg: '20px' },
              mb: { xs: '70px', sm: '30px', md: '35px', lg: '20px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Filters parentCallback={handleCallback} />
          </Box>
          <TableAttendances
            loading={isLoading}
            doubleClick={doubleClick}
            attendances={attendances}
            download={downloadHistoric}
          />
        </Card>
      </Container>
      <DetailAttendance
        associate={associate}
        open={openDetail}
        close={closeDetail}
        download={downloadAssociate}
        createCheckin={createCheckin}
        updateCheckin={updateCheckin}
      />
      <SnackAlert close={closeSnack} open={openSnack} message={message} type={type} />
      <ConfirmDialog
        open={openConfirmDialog}
        isLoading={isLoading}
        close={toggleConfirmDialog}
        title={'Actualizar registro'}
        body={'Es necesaria la contraseña para esta accion'}
        onConfirm={handleConfirm}
        verifyPassword
        error={errorPassword}
      />
    </Page>
  );
}
