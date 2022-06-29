import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Container, Card, Button, TextField, MenuItem } from '@mui/material';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import edit2Outline from '@iconify/icons-eva/edit-2-outline';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getAssociates,
  getAssociate,
  clearDataAssociate,
  create,
  update,
  destroy,
  restore,
  modifyAssociates,
  clearMessage
} from '../../redux/slices/associate';
import { getAreas } from '../../redux/slices/area';
import { getSubareasByArea } from '../../redux/slices/subarea';
import { getShifts } from '../../redux/slices/shift';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import AssociateForm from '../../components/associate/AssociateForm';
import TableAssociate from '../../components/associate/TableAssociates';
import SnackAlert from '../../components/general/SnackAlert';

export default function Associate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { associates, associate, isLoading, openMessage, typeMessage, message } = useSelector(
    (state) => state.associate
  );
  const { areas } = useSelector((state) => state.area);
  const { subareasArea } = useSelector((state) => state.subarea);
  const { shifts } = useSelector((state) => state.shift);
  const [openForm, setOpenForm] = useState(false);
  const [modeUpdate, setModeUpdate] = useState(false);
  const [selectedAssociates, setSelectedAssociates] = useState([]);
  const [changeSubarea, setChangeSubarea] = useState('');
  const [changeShift, setChangeShift] = useState('');
  const [trashed, setTrashed] = useState(false);

  useEffect(() => {
    dispatch(getAssociates());
    dispatch(getAreas());
    dispatch(getSubareasByArea());
    dispatch(getShifts());
  }, [dispatch]);

  const handleCloseForm = () => {
    dispatch(clearDataAssociate());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleUpdate = (id, values) => {
    dispatch(updateAssociate(id, values));

    setOpenForm(false);
  };

  const toggleTrashed = () => {
    dispatch(getAssociates(!trashed)).then(() => setTrashed(!trashed));
  };

  const handleModify = () => {
    dispatch(modifyAssociates(selectedAssociates, changeSubarea, changeShift)).then(() =>
      dispatch(getAssociates(trashed))
    );
  };

  function createAssociate(values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            create(
              values.name,
              values.employee,
              moment(values.entry).format('YYYY-MM-DD'),
              values.area,
              values.subarea,
              values.saalmauser,
              values.wamasuser,
              values.unionized
            )
          )
        );
      })
        .then(() => {
          dispatch(getAssociates());
          setOpenForm(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function updateAssociate(id, values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            update(
              id,
              values.name,
              values.employee,
              moment(values.entry).format('YYYY-MM-DD'),
              values.area,
              values.subarea,
              values.saalmauser,
              values.wamasuser,
              values.unionized
            )
          )
        );
      })
        .then(() => {
          dispatch(getAssociates(trashed));
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const handleCallbackAssociateForm = (values) => {
    dispatch(createAssociate(values));
  };

  const handleCloseMessage = () => {
    dispatch(clearMessage());
  };

  const doubleClickAssociates = (row) => {
    setOpenForm(true);
    setModeUpdate(true);
    dispatch(getAssociate(row.id));
    dispatch(getSubareasByArea(row.area_id));
  };

  const onChangeArea = (id) => {
    dispatch(getSubareasByArea(id));
  };

  const handleRestore = (id) => {
    dispatch(restoreAssociate(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteAssociate(id));
  };

  function deleteAssociate(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(id)));
      })
        .then(() => {
          dispatch(getAssociates());
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restoreAssociate(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restore(id)));
      })
        .then(() => {
          dispatch(getAssociates(trashed));
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <Page title="Colaboradores">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Mis Colaboradores"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <>
              <Button
                variant="contained"
                color={trashed ? 'success' : 'warning'}
                onClick={toggleTrashed}
                sx={{ marginRight: '20px' }}
              >
                {trashed ? `Ver asociados activos` : `Ver asociados eliminados`}
              </Button>
              <TextField
                id="shift"
                name="shift"
                label="Turno"
                onChange={(e, value) => {
                  setChangeShift(value.props.value);
                }}
                sx={{
                  display: selectedAssociates.length > 0 ? 'inline-flex' : 'none',
                  marginRight: '20px',
                  minWidth: '130px'
                }}
                value={changeShift}
                select
                size="small"
              >
                {shifts.map((option) => (
                  <MenuItem key={option.id} value={`${option.id}`}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="subarea"
                name="subarea"
                label="Subarea"
                onChange={(e, value) => {
                  setChangeSubarea(value.props.value);
                }}
                sx={{
                  display: selectedAssociates.length > 0 ? 'inline-flex' : 'none',
                  marginRight: '20px',
                  minWidth: '130px'
                }}
                value={changeSubarea}
                select
                size="small"
              >
                {subareasArea.map((option) => (
                  <MenuItem key={option.id} value={`${option.id}`}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleModify}
                sx={{ marginRight: '20px', display: selectedAssociates.length > 0 ? 'inline-flex' : 'none' }}
                startIcon={<Icon icon={edit2Outline} />}
              >
                Mover
              </Button>
              <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
                Nuevo
              </Button>
            </>
          }
        />
      </Container>
      <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <TableAssociate
            loading={isLoading}
            doubleClick={doubleClickAssociates}
            associates={associates}
            handleRestore={handleRestore}
            handleDelete={handleDelete}
            setSelectedAssociates={setSelectedAssociates}
          />
        </Card>
      </Container>
      <AssociateForm
        open={openForm}
        close={handleCloseForm}
        parentCallbackAssociate={handleCallbackAssociateForm}
        associate={associate}
        update={modeUpdate}
        updateRegister={handleUpdate}
        areas={areas}
        subareas={subareasArea}
        onChangeArea={onChangeArea}
      />
    </Page>
  );
}
