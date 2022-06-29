import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Button, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { VisibilityOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
// components
import ObjectiveDetail from './ObjectiveDetail';
// ----------------------------------------------------------------------

Detail.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  associate: PropTypes.object,
  download: PropTypes.func,
  update: PropTypes.func
};

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

const Jss1 = styled('div')({
  width: '100%',
  border: '1px solid rgb(169,169,169)',
  height: '26px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '2px'
});

const Jss2 = styled('div')({
  width: '100%',
  display: 'flex',
  position: 'absolute',
  lineHeight: '24px',
  justifyContent: 'center',
  color: '1px solid rgb(169,169,169)'
});

export default function Detail({ open, close, associate, download, update }) {
  const isLoading = false;
  const [objective, setObjective] = useState({});
  const [openDetail, setOpenDetail] = useState(false);
  const [nameAssociate, setNameAssociate] = useState('');

  useEffect(() => {
    setNameAssociate(associate.name + associate.lastnames);
  }, [associate]);

  const columns = [
    {
      field: 'name',
      headerName: 'Objetivo',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'weighing',
      headerName: 'Ponderacion',
      flex: 1,
      renderCell: (params) => {
        const avg = params.row.weighing;
        return (
          <Jss1>
            <Jss2>{avg > 0 ? avg : 0}%</Jss2>
            <div style={{ height: '100%', maxWidth: `${avg > 0 ? avg : 0}%`, backgroundColor: 'rgb(206, 198, 197)' }} />
          </Jss1>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      flex: 0.5,
      renderCell: (params) => {
        const onClickDownload = (e) => {
          e.stopPropagation();
          setObjective(params.row);
          setOpenDetail(true);
        };
        return [
          <Tooltip key={`dw-${params.row.id}`} title="Detalle">
            <VisibilityOutlined
              onClick={onClickDownload}
              key={`dw-${params.row.name}`}
              type="button"
              color="primary"
              style={filters.pinter}
            />
          </Tooltip>
        ];
      }
    }
  ];

  const handleClose = () => {
    setOpenDetail(false);
  };

  const handleUpdate = (id, values, objective) => {
    update(id, values, objective);
    setOpenDetail(false);
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={close} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          Objetivos de: {associate.name} {associate.lastnames}{' '}
        </DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  loading={isLoading}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={associate.objectives ?? []}
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
      <ObjectiveDetail
        objective={objective}
        downloadFile={download}
        close={handleClose}
        open={openDetail}
        name={nameAssociate}
        parentCallback={handleUpdate}
      />
    </>
  );
}
