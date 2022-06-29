import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  associates: [],
  associate: {},
  employeeNumberAvailable: true,
  errorMessage: '',
  message: '',
  typeMessage: 'success',
  openMessage: false
};

const slice = createSlice({
  name: 'associate',
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
    onCreateAssociate(state, action) {
      state.isLoading = false;
      state.message = action.payload.id
        ? `Asociado agregado: ${action.payload.name}`
        : `Ocurrió un error inesperado, contacte al administrador.`;
      state.openMessage = true;
      state.typeMessage = action.payload.id ? 'success' : 'error';
    },
    onUpdateAssociate(state, action) {
      state.isLoading = false;
      state.message = action.payload.id
        ? `Asociado actualizado: ${action.payload.name}`
        : `Ocurrió un error inesperado, contacte al administrador.`;
      state.openMessage = true;
      state.typeMessage = action.payload.id ? 'success' : 'error';
    },
    // GET POSTS
    getAssociatesSuccess(state, action) {
      state.isLoading = false;
      state.associates = action.payload;
      state.error = false;
    },
    getAssociateSuccess(state, action) {
      state.isLoading = false;
      state.associate = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.associate = initialState.associate;
    },
    onFindEmployee(state, action) {
      state.employeeNumberAvailable = action.payload.success;
      state.errorMessage = action.payload.message;
    },
    onModifyAssociates(state, action) {
      state.isLoading = false;
      state.message = action.payload.message;
      state.typeMessage = action.payload.success === true ? 'success' : 'error';
      state.openMessage = true;
    },
    clearMessage(state) {
      state.message = initialState.message;
      state.openMessage = initialState.openMessage;
      state.typeMessage = initialState.typeMessage;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { clearMessage, onFindEmployee } = slice.actions;

// ----------------------------------------------------------------------

export function getAssociates(trashed = false) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/associatelist', {
        params: { trashed }
      });
      dispatch(slice.actions.getAssociatesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAssociate(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/associates/${id}`);
      dispatch(slice.actions.getAssociateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function create(name, employee, entry, area, subarea, saalmauser, wamasuser, unionized) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      const response = await axios.post(`/api/v1/associates/store`, {
        name,
        employee_number: employee,
        entry_date: entry,
        area_id: area,
        subarea_id: subarea,
        user_saalma: saalmauser,
        wamas_user: wamasuser,
        unionized
      });
      dispatch(slice.actions.onCreateAssociate(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function update(id, name, employee, entry, area, subarea, saalmauser, wamasuser, unionized) {
  return async (dispatch) => {
    try {
      const response = await axios.patch(`/api/v1/associates/${id}`, {
        name,
        employee_number: employee,
        entry_date: entry,
        area_id: area,
        subarea_id: subarea,
        user_saalma: saalmauser,
        wamas_user: wamasuser,
        unionized
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function destroy(id) {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`/api/v1/associates/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function restore(id) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/v1/associates/restore/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function findEmployee(number) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/v1/associates/employee`, {
        params: {
          number
        }
      });
      dispatch(slice.actions.onFindEmployee(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function clearDataAssociate() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function modifyAssociates(associateIds, newArea, newShift) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/v1/associatelist/moveteam`, {
        associateIds,
        newArea,
        newShift
      });
      dispatch(slice.actions.onModifyAssociates(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function clear(associateIds, newArea, newShift) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/v1/associatelist/moveteam`, {
        associateIds,
        newArea,
        newShift
      });
      dispatch(slice.actions.onModifyAssociates(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
