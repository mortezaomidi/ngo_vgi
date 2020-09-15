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
import {create} from "./LayerAPI";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dbErrorHandler from "../../../../server/helpers/dbErrorHandler";
import {Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Row} from "reactstrap";
import auth from "../../auth/auth-helper";



const CreateLayer = (props) => {

  const user = auth.getToken();

  const [values, setValues] = useState({
    name: '',
    user: '',
    geometry: '',
    error: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  };

  const clickSubmit = () => {
    const layer = {
      name: values.name || undefined,
      user: user._id || undefined,
      geometry: values.geometry || undefined
    };
    create(layer).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error});
        toast.error('اطلاعات وارد شده نادرست است')
      } else {
        setValues({ ...values, error: '', open: true});
        toast.success('عملیات با موفقیت انجام شد', {
          onClose : () => props.history.push('/layers')
        });
      }
    })
  };


  return (
    <div className="animated fadeIn">
      <ToastContainer
        rtl={true}
        autoClose={1500}
      />
      <Row>
        <Col lg='12'>
          <Card>
            <CardHeader>
              <h6>اضافه کردن لایه</h6>
            </CardHeader>
            <CardBody>
              <Row xs={12}>
                <Col xs='4'>
                  <FormGroup>
                    <Label>نام</Label>
                    <Input
                      type='text'
                      id='name'
                      placeholder='نام لایه را وارد کنید.'
                      required
                      value={values.name}
                      onChange={handleChange('name')}
                    />
                  </FormGroup>
                </Col>
                <Col xs='2'>
                  <FormGroup>
                    <Label>هندسه لایه</Label>
                    <Input
                      type='select'
                      id='geometry'
                      name='geometry'
                      required
                      onChange={handleChange('geometry')}
                    >
                      <option></option>
                      <option value='Point'>نقطه</option>
                      <option value='Line'>خط</option>
                      <option value='Polygon'>پلیگون</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button type="submit" size="sm" color="primary" onClick={()=>clickSubmit()}>
                <strong>ثبت</strong>
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CreateLayer;
