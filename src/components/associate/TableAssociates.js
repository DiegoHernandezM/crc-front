import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { DataGrid, esES } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Delete, RestoreFromTrash } from '@mui/icons-material';
// components
import { QuickSearch } from '../tables';
import DialogConfirm from '../general/DialogConfirm';

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

TableAssociate.propTypes = {
  doubleClick: PropTypes.func,
  associates: PropTypes.array,
  loading: PropTypes.bool,
  handleRestore: PropTypes.func,
  handleDelete: PropTypes.func,
  setSelectedAssociates: PropTypes.func
};

export default function TableAssociate({
  associates,
  doubleClick,
  loading,
  handleRestore,
  handleDelete,
  setSelectedAssociates
}) {
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [titleDialog, setTitleDialog] = useState('');
  const [bodyDialog, setBodyDialog] = useState('');
  const [restore, setRestore] = useState(false);
  const [id, setId] = useState(0);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCloseAccept = () => {
    if (restore) {
      handleRestore(id);
    } else {
      handleDelete(id);
    }
    setOpenConfirm(false);
  };

  const columns = [
    {
      field: 'employee_number',
      headerName: 'Núm.',
      width: 100,
      align: 'right',
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'name',
      headerName: 'Nombre',
      width: 230,
      renderCell: (params) => `${params.row.name}`,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'entry_date',
      headerName: 'Ingreso',
      width: 130,
      renderCell: (params) => params.value.split(' ')[0],
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'area',
      headerName: 'Area',
      width: 120,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'subarea',
      headerName: 'Subarea',
      width: 120,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'shift',
      headerName: 'Turno',
      width: 120,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'unionized',
      headerName: 'Sindicalizado',
      width: 100,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (params.value ? 'Si' : 'No')
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      width: 100,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setRestore(false);
          handleOpenConfirm();
          setTitleDialog('Eliminar asociado');
          setBodyDialog('Desea eliminar el registro?');
          setId(params.row.id);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          handleOpenConfirm();
          setRestore(true);
          setTitleDialog('Recuperar asociado');
          setBodyDialog('Desea recuperar el registro?');
          setId(params.row.id);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null}
                  onClick={onClickDelete}
                  key={`delete-${params.row.id}`}
                  type="button"
                  color="error"
                  style={filters.pinter}
                >
                  <Delete />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip key={`res-${params.row.id}`} title="Recuperar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at === null}
                  color="success"
                  onClick={onClickRestore}
                  key={`restore-${params.row.id}`}
                  type="button"
                  style={filters.pinter}
                >
                  <RestoreFromTrash />
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
    const filteredRows = associates.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  return (
    <>
      <div style={{ height: 600, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              components={{
                Toolbar: QuickSearch
              }}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
                setSelectedAssociates([...newSelectionModel]);
              }}
              selectionModel={selectionModel}
              loading={loading}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={rows.length > 0 ? rows : associates}
              columns={columns}
              rowHeight={40}
              componentsProps={{
                hideFooterPagination: false,
                toolbar: {
                  hideFooterPagination: false,
                  export: true,
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
                doubleClick(params.row);
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
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={titleDialog}
        body={bodyDialog}
        agree={handleCloseAccept}
      />
    </>
  );
}
