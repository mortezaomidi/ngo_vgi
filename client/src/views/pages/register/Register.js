import React, {useState} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {create} from "../../user/UserAPI";
import classes from '../../user/user.module.css';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import errorHandler from "../../../../../server/helpers/dbErrorHandler";


const Register = (props) => {

  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  };

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error});
        toast.error('اطلاعات وارد شده نادرست است')
      } else {
        setValues({ ...values, error: '', open: true})
        props.history.replace('./login');
      }
    })
  };


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <ToastContainer
        rtl={true}
        autoClose={1500}
      />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8" lg="6" xl="5">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h5 style={{textAlign:'center'}}>SignUp</h5>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="text"
                      placeholder="Name"
                      autoComplete="name"
                      required
                      value={values.name}
                      onChange={handleChange('name')}
                      className={classes.placeholderStyle}

                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="text"
                      placeholder="Email"
                      autoComplete="email"
                      required
                      value={values.email}
                      onChange={handleChange('email')}
                      className={classes.placeholderStyle}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      required
                      value={values.password}
                      onChange={handleChange('password')}
                      className={classes.placeholderStyle}

                    />
                  </CInputGroup>
                  <CButton color="success" block onClick={()=>clickSubmit()}>Create Account</CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
