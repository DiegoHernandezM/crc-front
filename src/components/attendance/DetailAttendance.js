import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { QuickSearch } from '../tables';
// components
import FormCheckin from './FormCheckin';
// ----------------------------------------------------------------------

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

DetailAttendance.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  associate: PropTypes.object,
  download: PropTypes.func,
  createCheckin: PropTypes.func,
  updateCheckin: PropTypes.func
};

export default function DetailAttendance({ open, close, associate, download, createCheckin, updateCheckin }) {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [modeUpdate, setModeUpdate] = useState(false);
  const [check, setCheck] = useState({});

  const columns = [
    {
      field: 'checkin',
      headerName: 'Entrada',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'checkout',
      headerName: 'Salida',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'register',
      headerName: 'Horas registradas',
      flex: 0.8,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'assign',
      headerName: 'Horas asignadas',
      flex: 0.8,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'extra',
      headerName: 'Horas extra',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      flex: 0.3,
      renderCell: (params) => {
        const onClickEdit = (e) => {
          e.stopPropagation();
          setModeUpdate(true);
          setCheck(params.row);
          setOpenForm(true);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Editar">
              <div>
                <IconButton
                  onClick={onClickEdit}
                  key={`re-${params.row.id}`}
                  type="button"
                  color="primary"
                  style={filters.pinter}
                >
                  <EditOutlined />
                </IconButton>
              </div>
            </Tooltip>
          </>
        );
      }
    }
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = associate.checkin.filter((row) =>
      Object.keys(row).some((field) => searchRegex.test(row[field]))
    );
    setRows(filteredRows);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setModeUpdate(false);
    setOpenForm(false);
  };

  const create = (values) => {
    createCheckin(associate.id, values);
    setOpenForm(false);
  };

  const updateCheck = (id, values) => {
    updateCheckin(id, values);
    setOpenForm(false);
  };

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={open} onClose={close} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          Registros de: {associate.name}
          <Button
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
            onClick={handleOpenForm}
          >
            Nuevo
          </Button>
        </DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  components={{
                    Toolbar: QuickSearch
                  }}
                  componentsProps={{
                    hideFooterPagination: false,
                    toolbar: {
                      hideFooterPagination: false,
                      export: false,
                      columns: true,
                      density: true,
                      search: false,
                      customExport: true,
                      value: searchText,
                      onClick: download,
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch('')
                    }
                  }}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={rows.length > 0 ? rows : associate.checkin}
                  columns={columns}
                  rowHeight={40}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={close}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <FormCheckin
        open={openForm}
        close={handleCloseForm}
        parentCallback={create}
        check={check}
        update={modeUpdate}
        updateCheck={updateCheck}
      />
    </>
  );
}
