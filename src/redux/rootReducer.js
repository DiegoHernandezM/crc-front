import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import calendarReducer from './slices/calendar';
import associateReducer from './slices/associate';
import userReducer from './slices/user';
import areaReducer from './slices/area';
import subareaReducer from './slices/subarea';
import petitionReducer from './slices/petition';
import taskReducer from './slices/task';
import taskManagerReducer from './slices/taskManager';
import dashboardReducer from './slices/dashboard';
// CRC
import productivityReducer from './slices/productivity';
import checkinReducer from './slices/checkin';
import shiftReducer from './slices/shift';
import associateTypeReducer from './slices/associateType';
import attendanceReducer from './slices/attendance';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  calendar: calendarReducer,
  associate: associateReducer,
  user: userReducer,
  area: areaReducer,
  subarea: subareaReducer,
  dashboard: dashboardReducer,
  petition: petitionReducer,
  task: taskReducer,
  taskManager: taskManagerReducer,
  productivity: productivityReducer,
  checkin: checkinReducer,
  shift: shiftReducer,
  associateType: associateTypeReducer,
  attendance: attendanceReducer
});

export { rootPersistConfig, rootReducer };
