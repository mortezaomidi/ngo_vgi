import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import Recaptcha from 'react-recaptcha';

import classes from "../../user/user.module.css";
import {signin} from "../../../auth/api-auth";
import auth from "../../../auth/auth-helper";

const Login = (props) => {

  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  };

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
        console.log(data.error);
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: ''})
        });
        props.history.replace('./dashboard');
      }
    })
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        className={classes.placeholderStyle}
                        value={values.email}
                        onChange={handleChange('email')}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        className={classes.placeholderStyle}
                        value={values.password}
                        onChange={handleChange('password')}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={()=>clickSubmit()}>Login</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{width: '44%'}}>
                <CCardBody className="text-center">
                  <div>
                    <h4>سازمان جغرافیایی نیروهای مسلح</h4>
                    <br/>
                    <p>داشبورد مدیریتی سامانه اطلاعات جغرافیایی داوطلبانه</p>
                    <br/>
                    <br/>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>ثبت نام کاربر</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
};
export default Login
