import { useEffect, useState } from 'react';
// @mui
import { Grid, Container, Typography, Card, CardContent, TextField } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// hooks
import { DataGrid, esES } from '@mui/x-data-grid';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { useDispatch, useSelector } from '../../redux/store';
import { getCheckin, register } from '../../redux/slices/checkin';
import SnackAlert from '../../components/general/SnackAlert';
// sections
// ----------------------------------------------------------------------]
const theme = createTheme({
  typography: {
    fontFamily: ['sans-serif'].join(',')
  }
});

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { checkin, associate, message, isLoading } = useSelector((state) => state.checkin);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const [employee, setEmployee] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('error');

  useEffect(() => {
    dispatch(getCheckin());
    const intervalClock = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalClock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {
      field: 'employee',
      headerName: '#',
      width: 90,
      renderCell: (params) => params.row.associate.employee_number,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'name',
      headerName: 'Colaborador',
      width: 290,
      renderCell: (params) => params.row.associate.name,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'area',
      headerName: 'Area',
      width: 100,
      renderCell: (params) => params.row.associate.area,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'shift',
      headerName: 'Horario',
      width: 100,
      renderCell: (params) => params.row.associate.shift,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'checkin',
      headerName: 'Entrada',
      width: 170,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'checkout',
      headerName: 'Salida',
      width: 170,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    }
  ];

  const checkAssociate = (e) => {
    setEmployee(e.target.value);
  };

  const changeEmployee = (e) => {
    if (e.key === 'Enter') {
      dispatch(registerCheck());
    }
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function registerCheck() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(register(employee)));
      })
        .then((response) => {
          if (response.message !== '') {
            setOpenMessage(true);
          }
          setEmployee('');
        })
        .catch((error) => {
          setTypeMessage('error');
          setOpenMessage(true);
          console.log(error);
        });
  }

  return (
    <Page title="Checador">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Checador
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={12}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CardContent>
                <Typography theme={theme} variant="h1">
                  {clock}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Card>
              <div style={{ height: 400, width: '100%' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      loading={isLoading}
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      rows={checkin ?? []}
                      columns={columns}
                      rowHeight={40}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <TextField
                  id="name"
                  name="name"
                  label="No. Empleado"
                  variant="outlined"
                  autoFocus
                  value={employee}
                  fullWidth
                  onChange={checkAssociate}
                  onKeyPress={changeEmployee}
                />
                <Typography
                  variant="h4"
                  style={{
                    marginTop: '30%',
                    marginLeft: '10px',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {associate.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
      </Container>
    </Page>
  );
}
