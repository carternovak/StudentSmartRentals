// rootReducer.js
import { combineReducers } from 'redux';
import paymentReducer from './PaymentContext'; // Import your payment reducer

const rootReducer = combineReducers({
  payment: paymentReducer,
  // Add other reducers as needed
});

export default rootReducer;