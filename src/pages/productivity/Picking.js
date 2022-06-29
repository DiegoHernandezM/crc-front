import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, format } from 'date-fns';
// material
import { Container, Card, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, esES } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getPickingProductivity, getReportPicking, loadPickingProductivity } from '../../redux/slices/productivity';
// components
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import SnackAlert from '../../components/general/SnackAlert';
import PickingFilters from '../../components/productivity/PickingFilters';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const Input = styled('input')({
  display: 'none'
});

export default function Picking() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { picking, isLoading, message, typeMessage, date } = useSelector((state) => state.productivity);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const day = new Date();
  const [selectedDate, setSelectedDate] = useState({
    dateInit: startOfWeek(day, { weekStartsOn: 3 }),
    dateEnd: endOfWeek(day, { weekStartsOn: 3 })
  });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (date !== '') {
      const day = new Date(date);
      const dates = {
        dateInit: startOfWeek(day, { weekStartsOn: 3 }),
        dateEnd: endOfWeek(day, { weekStartsOn: 3 })
      };
      setSelectedDate(dates);
      handleCallback(dates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const columns = [
    {
      field: 'employee_number',
      headerName: 'No. Empleado',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 2,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'bonus_date',
      headerName: 'Fecha prod',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'boxes_shift',
      headerName: 'Cajas / turno',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'bonus_amount',
      headerName: 'Bono',
      flex: 0.5,
      type: 'currency',
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => `$ ${params.row.bonus_amount.toFixed(2)}`
    }
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = picking.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      dispatch(loadPickingProductivity(d)).then(() => {
        setOpenMessage(true);
      });
    });
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleCallback = (values) => {
    const filter = {
      dateInit: format(values.dateInit, 'yyyy-MM-dd'),
      dateEnd: format(values.dateEnd, 'yyyy-MM-dd')
    };
    setSelectedDate(filter);
    dispatch(getPickingProductivity(filter));
  };

  function getExport() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(getReportPicking(selectedDate)));
      })
        .then((response) => {
          const contentType = response.headers['content-type'];
          const filename = 'productividad_picking.xlsx';
          const file = new Blob([response.data], { type: contentType });
          // For Internet Explorer and Edge
          if ('msSaveOrOpenBlob' in window.navigator) {
            window.navigator.msSaveOrOpenBlob(file, filename);
          }
          // For Firefox and Chrome
          else {
            // Bind blob on disk to ObjectURL
            const data = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.style = 'display: none';
            a.href = data;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            // For Firefox
            setTimeout(() => {
              document.body.removeChild(a);
              // Release resource on disk after triggering the download
              window.URL.revokeObjectURL(data);
            }, 100);
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function getExcel() {
    dispatch(getExport());
  }

  return (
    <Page title="Productividad Picking">
      <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
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
            <PickingFilters parentCallback={handleCallback} />
            <>{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}</>
            <label htmlFor="contained-button-file">
              <Input
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="contained-button-file"
                type="file"
                onChange={(file) => {
                  readExcel(file.target.files[0]);
                }}
              />
              <Button variant="contained" component="span">
                Cargar excel
              </Button>
            </label>
          </Box>
          <div style={{ height: 600, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  components={{
                    Toolbar: QuickSearch
                  }}
                  loading={isLoading}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={rows.length > 0 ? rows : picking}
                  columns={columns}
                  rowHeight={40}
                  componentsProps={{
                    hideFooterPagination: false,
                    toolbar: {
                      hideFooterPagination: false,
                      export: false,
                      columns: true,
                      density: true,
                      search: true,
                      customExport: true,
                      value: searchText,
                      onClick: () => getExcel(),
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch('')
                    }
                  }}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                  }}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                />
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </Page>
  );
}
