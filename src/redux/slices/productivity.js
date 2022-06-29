import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  picking: [],
  message: '',
  typeMessage: 'error',
  date: ''
};

const slice = createSlice({
  name: 'productivity',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    onGetPickingProductivity(state, action) {
      state.isLoading = false;
      state.picking = action.payload;
    },

    onLoadPickingProductivity(state, action) {
      state.isLoading = false;
      state.message = action.payload.message;
      state.typeMessage = action.payload.typeMessage;
      state.date = action.payload.date;
    },

    onGetReportPicking(state) {
      state.isLoading = false;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getPickingProductivity(filters) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/reports/datapickingbonus', {
        params: {
          dateInit: filters.dateInit,
          dateEnd: filters.dateEnd
        }
      });
      dispatch(slice.actions.onGetPickingProductivity(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSorterProductivity(filters) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/reports/datapickingbonus', {
        params: {
          dateInit: filters.dateInit,
          dateEnd: filters.dateEnd
        }
      });
      dispatch(slice.actions.onGetPickingProductivity(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export const loadPickingProductivity = (data) => async () => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post(`/api/v1/reports/loadpickingproductivity`, {
      data
    });
    dispatch(slice.actions.onLoadPickingProductivity(response.data));
    return Promise.resolve(response);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    return Promise.resolve(error);
  }
};

export const getReportPicking = (filters) => async () => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/api/v1/reports/exportpickingbonus`, {
      params: {
        dateInit: filters.dateInit,
        dateEnd: filters.dateEnd
      },
      responseType: 'blob'
    });
    dispatch(slice.actions.onGetReportPicking(response));
    return Promise.resolve(response);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    return Promise.resolve(error);
  }
};

export const getReportSorter = (filters) => async () => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/api/v1/reports/exportpickingbonus`, {
      params: {
        dateInit: filters.dateInit,
        dateEnd: filters.dateEnd
      },
      responseType: 'blob'
    });
    dispatch(slice.actions.onGetReportPicking(response));
    return Promise.resolve(response);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    return Promise.resolve(error);
  }
};
