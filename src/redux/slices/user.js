import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoadingUser: false,
  error: false,
  users: [],
  user: {},
  permissions: [],
  roles: [],
  showUser: []
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoadingUser = true;
    },

    // HAS ERROR
    hasError(state) {
      state.isLoadingUser = false;
      state.error = true;
    },

    createUserSuccess(state) {
      state.isLoadingUser = false;
    },

    updateUserSuccess(state) {
      state.isLoadingUser = false;
    },

    // GET POSTS
    getUsersSuccess(state, action) {
      state.isLoadingUser = false;
      state.users = action.payload;
      state.error = false;
    },
    getUserSuccess(state, action) {
      state.isLoadingUser = false;
      state.user = action.payload;
      state.error = false;
    },
    getPermissionsSuccess(state, action) {
      state.isLoadingUser = false;
      state.permissions = action.payload;
      state.error = false;
    },
    getRolesSuccess(state, action) {
      state.isLoadingUser = false;
      state.roles = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.user = initialState.user;
    },
    getShowLogued(state, action) {
      state.isLoading = false;
      state.showUser = action.payload;
      state.error = false;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/users/all');
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/users/find/${id}`);
      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createUser(firstName, lastName, email, area, password, role) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/api/v1/users/create`, {
        first_name: firstName,
        last_name: lastName,
        email,
        area_id: area,
        password,
        role
      });
      dispatch(slice.actions.createUserSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateUser(id, firstName, lastName, email, area, role) {
  return async (dispatch) => {
    try {
      await axios.patch(`/api/v1/users/update/${id}`, {
        first_name: firstName,
        last_name: lastName,
        email,
        area_id: area,
        role
      });
      dispatch(slice.actions.updateUserSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function destroyUser(id) {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/v1/users/${id}`);
      dispatch(slice.actions.updateUserSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function restoreUser(id) {
  return async (dispatch) => {
    try {
      await axios.post(`/api/v1/users/${id}/restore`);
      dispatch(slice.actions.updateUserSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPermissions() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/permissions/list`);
      dispatch(slice.actions.getPermissionsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRoles() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/permissions/roles`);
      dispatch(slice.actions.getRolesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function clearDataUser() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function showLogued() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/users/showlogued`);
      dispatch(slice.actions.getShowLogued(response.data.user));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function changePassword(oldPassword, newPassword, newPasswordConfirmation) {
  // eslint-disable-next-line consistent-return
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/users/changepassword`, {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}
