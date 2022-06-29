import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import { DataGrid, esES } from '@mui/x-data-grid';
// components
import { QuickSearch } from '../tables';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

TableAttendances.propTypes = {
  doubleClick: PropTypes.func,
  attendances: PropTypes.array,
  loading: PropTypes.bool,
  download: PropTypes.func
};

export default function TableAttendances({ attendances, doubleClick, loading, download }) {
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1.5,
      renderCell: (params) => `${params.row.name}`,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'attendance',
      headerName: 'Registros',
      flex: 0.3,
      renderCell: (params) => params.row.checkin.length,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'employee_number',
      headerName: 'Empleado',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'entry_date',
      headerName: 'Ingreso',
      flex: 0.5,
      renderCell: (params) => `${moment(params.row.entry_date).format('YYYY-MM-DD')}`,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    }
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = attendances.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
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
              loading={loading}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={rows.length > 0 ? rows : attendances}
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
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => requestSearch(''),
                  onClick: download
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
    </>
  );
}
