import { createStore } from 'redux';
import notificationReducer from "./@pages/Notifications/reducer";

let store = createStore(notificationReducer);

export default store;
