import { useState, useEffect } from 'react';
// material
import { Container, Card, Button, Tooltip, Typography } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { RadioButtonChecked as EnableIcon } from '@mui/icons-material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAreas } from '../../redux/slices/area';
import { getShifts, getShift, clearDataShift, create, update, destroy, restore } from '../../redux/slices/shift';

// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import ShiftForm from '../../components/shift/ShiftForm';
import useAuth from '../../hooks/useAuth';
import SnackAlert from '../../components/general/SnackAlert';
import DialogConfirm from '../../components/general/DialogConfirm';

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function Shift() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.area);
  const { shifts, shift, isLoading } = useSelector((state) => state.shift);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [modeUpdate, setModeUpdate] = useState(false);
  const [rows, setRows] = useState([]);
  const { user } = useAuth();
  const [shiftId, setShiftId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [modeRestore, setModeRestore] = useState(false);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'area',
      headerName: 'Area',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (
        <div>
          <Typography>{params.row.area.name}</Typography>
        </div>
      )
    },
    {
      field: 'deleted_at',
      headerName: 'Estatus',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (
        <div>
          <Tooltip
            title={params.row.deleted_at === null ? 'Horario habilitado' : 'Horario deshabilitado'}
            aria-label="add"
          >
            <EnableIcon style={{ color: params.row.deleted_at === null ? 'green' : 'gray', marginTop: '10px' }} />
          </Tooltip>
        </div>
      )
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      flex: 0.5,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setShiftId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(false);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          setShiftId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(true);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null}
                  onClick={onClickDelete}
                  key={`re-${params.row.id}`}
                  type="button"
                  color="primary"
                  style={filters.pinter}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip key={`res-${params.row.id}`} title="Recuperar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at === null}
                  color="primary"
                  onClick={onClickRestore}
                  key={`re-${params.row.id}`}
                  type="button"
                  style={filters.pinter}
                >
                  <RestoreFromTrashIcon />
                </IconButton>
              </div>
            </Tooltip>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    dispatch(getShifts());
    dispatch(getAreas());
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = shifts.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataShift());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleCloseConfirm = () => {
    if (modeRestore === false) {
      setModeUpdate(false);
      setOpenConfirm(false);
      setModeRestore(false);
    } else {
      setModeUpdate(false);
      setOpenConfirm(false);
      setModeRestore(true);
    }
  };

  const handleCloseAccept = () => {
    if (modeRestore === false) {
      setOpenConfirm(false);
      dispatch(deleteShift());
    } else {
      setOpenConfirm(false);
      dispatch(restoreShift());
    }
  };

  const handleUpdate = (id, name, checkin, checkout, areaId) => {
    setOpenForm(false);
    dispatch(updateShift(id, name, checkin, checkout, areaId));
  };

  const handleCallbackForm = (values, shifts) => {
    dispatch(createShift(values.name, shifts, values.areaId));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function createShift(name, shifts, areaId) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(create(name, shifts, areaId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Horario creado' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getShifts());
          setOpenMessage(true);
          setOpenForm(false);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function updateShift(id, name, shifts, areaId) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(update(id, name, shifts, areaId)));
      })
        .then((response) => {
          dispatch(getShifts());
          setMessage(response.status === 200 ? 'Actualizacion realizada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function deleteShift() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(shiftId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Horario eliminado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getShifts());
          setShiftId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restoreShift() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restore(shiftId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Horario recuperado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getShifts());
          setShiftId(0);
          setModeRestore(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <Page title="Horarios">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Horarios"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nuevo Horario
            </Button>
          }
        />
      </Container>
      <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <div style={{ height: 600, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  components={{
                    Toolbar: QuickSearch
                  }}
                  loading={isLoading}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={rows.length > 0 ? rows : shifts}
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
                      customExport: false,
                      value: searchText,
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch('')
                    }
                  }}
                  onRowDoubleClick={(params) => {
                    dispatch(getShift(params.row.id));
                    setModeUpdate(true);
                    setOpenForm(true);
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
      <ShiftForm
        open={openForm}
        close={handleCloseForm}
        parentCallback={handleCallbackForm}
        areas={areas}
        shift={shift}
        update={modeUpdate}
        updateShift={handleUpdate}
        permissions={user.permissions}
      />
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={modeRestore === false ? 'Eliminar Horario' : 'Recuperar Horario'}
        body={modeRestore === false ? 'Desea eliminar este horario' : 'Desea recuperar este horario'}
        agree={handleCloseAccept}
      />
    </Page>
  );
}
