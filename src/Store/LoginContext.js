import React, { useReducer } from "react";
import { createContext } from "react";

export const LoginContext = createContext({
  token: "",
  makeLogin: () => {},
  makeLogoff: () => {},
});

const InfoReducer = (state, action) => {
  let newState = { ...state };
  if (action.type === "MAKE_LOGIN") {
    newState.token = action.val;
    return newState;
  } else if (action.type === "MAKE_LOGOFF") {
    newState.token = "";
    return newState;    
  }
};

export const LoginContextProvider = (props) => {
  const [infoState, dispatch] = useReducer(InfoReducer, {
    token: "",
  });

  const onMakeLogin = (token) => {
      dispatch({ type: "MAKE_LOGIN", val: token });
  };

  const onMakeLogoff = (info) => {
      dispatch({ type: "MAKE_LOGOFF" });
  };

  return (
    <LoginContext.Provider
      value={{
        token: infoState.token,
        onMakeLogin,
        onMakeLogoff,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};