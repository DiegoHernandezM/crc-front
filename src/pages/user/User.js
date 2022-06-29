import { useState, useEffect } from 'react';
import { Button, Card, Container } from '@mui/material';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import UserForm from '../../components/user/UserForm';
import TableUsers from '../../components/user/TableUsers';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import { useDispatch, useSelector } from '../../redux/store';
import { getUsers, getUser, getRoles, createUser, updateUser, destroyUser, restoreUser } from '../../redux/slices/user';
import { getAreas } from '../../redux/slices/area';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

export default function User() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const { users, user, roles } = useSelector((state) => state.user);
  const { areas } = useSelector((state) => state.area);
  const [modeUpdate, setModeUpdate] = useState(false);
  const [openForm, setOpenForm] = useState();

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getAreas());
    dispatch(getRoles());
  }, [dispatch]);

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleGetUser = (id) => {
    setModeUpdate(true);
    dispatch(getUser(id)).then(() => setOpenForm(true));
  };

  const handleRestore = (id) => {
    dispatch(restoreUser(id)).then(() => dispatch(getUsers()));
  };

  const handleSaveUser = (values) => {
    dispatch(
      createUser(values.first_name, values.last_name, values.email, values.area, values.password, values.role)
    ).then(() => {
      setOpenForm(false);
      dispatch(getUsers());
    });
  };

  const handleDeleteUser = (id) => {
    dispatch(destroyUser(id)).then(() => dispatch(getUsers()));
  };

  const handleUpdateUser = (id, values) => {
    dispatch(updateUser(id, values.first_name, values.last_name, values.email, values.area, values.role)).then(() => {
      setOpenForm(false);
      dispatch(getUsers());
    });
  };

  return (
    <Page title="Usuarios">
      <UserForm
        open={openForm}
        close={handleCloseForm}
        parentCallback={handleSaveUser}
        user={user}
        areas={areas}
        update={modeUpdate}
        updateUser={handleUpdateUser}
        roles={roles}
      />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Usuarios"
          links={[{ name: '', href: '' }]}
          action={
            <>
              <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
                Nuevo
              </Button>
            </>
          }
        />
        <Card>
          <TableUsers
            users={users}
            doubleClick={handleGetUser}
            handleDelete={handleDeleteUser}
            handleRestore={handleRestore}
          />
        </Card>
      </Container>
    </Page>
  );
}
