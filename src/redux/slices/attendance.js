import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  attendances: []
};

const slice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    // HAS ERROR
    hasError(state) {
      state.isLoading = false;
      state.error = true;
    },
    // GET POSTS
    getAttendancesSuccess(state, action) {
      state.isLoading = false;
      state.attendances = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.area = initialState.area;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAttendances(init, end) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/attendance/all', {
        params: {
          init,
          end
        }
      });
      dispatch(slice.actions.getAttendancesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getHistoricCsv(init, end) {
  // eslint-disable-next-line consistent-return
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/attendance/historic`, {
        params: {
          init,
          end
        },
        responseType: 'blob'
      });
      dispatch(slice.actions.stopLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAssociateCsv(id, init, end) {
  // eslint-disable-next-line consistent-return
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/attendance/associate/historic/${id}`, {
        params: {
          init,
          end
        },
        responseType: 'blob'
      });
      dispatch(slice.actions.stopLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function clearDataArea() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
