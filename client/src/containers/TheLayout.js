import React,{useEffect, useContext} from 'react';

import {
  TheContent,
  TheSidebar,
  TheFooter,
  // TheHeader
} from './index'
import {AuthContext} from "../auth/auth-context";

const TheLayout = (props) => {

  const {dispatch} = useContext(AuthContext);

  useEffect(()=>{
    dispatch({type:'check', payload: props})
  });

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        {/*<TheHeader/>*/}
        <div className="c-body">
          <TheContent/>
        </div>
        {/*<TheFooter/>*/}
      </div>
    </div>
  )
}

export default TheLayout
