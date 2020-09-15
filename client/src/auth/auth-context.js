import React, {useReducer} from 'react';
export const AuthContext = React.createContext();


const authReducer = (state, action) =>{
  if (action.type == 'check') {
      const user = sessionStorage.getItem('jwt');
      if(!user){
        action.payload.history.push('/login');
      }
      return state;
  }
};

const AuthContextProvider = (props) =>{
  const [state, dispatch] = useReducer(authReducer,'');

  return(
    <AuthContext.Provider value={{state,dispatch}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default AuthContextProvider;
