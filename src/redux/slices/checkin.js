import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  checkin: [],
  check: {},
  associate: {},
  message: ''
};

const slice = createSlice({
  name: 'checkin',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state) {
      state.isLoading = false;
      state.error = true;
    },

    // GET POSTS
    getCheckinSuccess(state, action) {
      state.isLoading = false;
      state.checkin = action.payload;
      state.error = false;
    },
    getCheckSuccess(state, action) {
      state.isLoading = false;
      state.check = action.payload;
      state.error = false;
    },
    getRegisterSuccess(state, action) {
      state.isLoading = false;
      state.associate = action.payload.associate;
      state.checkin = action.payload.associates;
      state.message = action.payload.message;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.check = initialState.check;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCheckin() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/checkin/all');
      dispatch(slice.actions.getCheckinSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCheck(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/checkin/associate/${id}`);
      dispatch(slice.actions.getCheckSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCheckinAssociate(id, init, end) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/checkin/associate/${id}`, {
        params: { init, end }
      });
      dispatch(slice.actions.getCheckSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function create(id, checkin, checkout) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/checkin/store`, {
        id,
        checkin,
        checkout
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function register(number) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/checkin/check`, {
        employee_number: number
      });
      dispatch(slice.actions.getRegisterSuccess(response.data));
      return Promise.resolve(response.data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function update(id, checkin, checkout, comments, password) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/checkin/update/${id}`, {
        checkin,
        checkout,
        comments,
        password
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function clearDataCheck() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
