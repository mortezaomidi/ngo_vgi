import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Spinner, Table} from "reactstrap";
import auth from "../../auth/auth-helper";
import {read, update} from "./UserAPI";
import {Link} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = (props) => {

  const {userId} = props.match.params;
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: '',
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({
      userId: userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, name: data.name, email: data.email});
      }
    });

    return function cleanup(){
      abortController.abort()
    }

  }, [userId]);

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    };
    update({
      userId: userId
    }, user).then((data) => {
      if (data && data.error) {
        toast.error('خطا در برقراری ارتباط');
        setValues({...values, error: data.error})
      } else {
        setValues({...values, userId: data._id});
        toast.success('عملیات با موفقیت انجام شد', {
          onClose : () => props.history.push('/users')
        });
      }
    })
  };
  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value})
  };

  return (
  <div className="animated fadeIn">
    <ToastContainer
      rtl={true}
      autoClose={500}
    />
    <Card>
      <CardHeader>
        <h6>اویرایش اطلاعات کاربری</h6>
      </CardHeader>
      <CardBody>
        <FormGroup row className="my-0">
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="name">نام کاربری</Label>
              <Input
                type="text"
                id="title"
                value={values.name}
                onChange={handleChange('name')}
                placeholder= {values.name}
                required
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="label">ایمیل کاربر</Label>
              <Input
                type="text"
                id="email"
                value={values.email}
                onChange={handleChange('email')}
                placeholder= {values.email}
                required
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label htmlFor="mainSubTitle">رمزعبور</Label>
              <Input
                type="password"
                id="password"
                value={values.password}
                onChange={handleChange('password')}
                placeholder= {values.password}
                required
              />
            </FormGroup>
          </Col>
        </FormGroup>
      </CardBody>
      <CardFooter>
        <Button type="submit" size="sm" color="primary"  onClick={() => clickSubmit()}>
          <strong>ثبت</strong>
        </Button>
      </CardFooter>
    </Card>
  </div>
  )
};
export default EditProfile;

