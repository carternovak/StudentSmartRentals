import { createContext, useReducer } from "react";

export const PaymentContext = createContext();

export const PaymentContextProvider = ({ children }) => {
  const INIT_STATE = {
    paymentMethod: 'usd',
    paymentAmount: 1500,
  };

  const paymentReducer = (state, action) => {
    switch (action.type) {
      case "SET_PAYMENT_METHOD":
        return {
          ...state,
          paymentMethod: action.payload,
        };
      case "SET_PAYMENT_AMOUNT":
        return {
          ...state,
          paymentAmount: action.payload,
        };
      case "RESET_PAYMENT_STATE":
        return {
          paymentMethod: null,
          paymentAmount: 0,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(paymentReducer, INIT_STATE);

  return (
    <PaymentContext.Provider value={{ data: state, dispatch }}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;