import React, {useEffect, useState} from 'react'

import {create} from "./FeatureAPI";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dbErrorHandler from "../../../../server/helpers/dbErrorHandler";
import {Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Row} from "reactstrap";
import auth from "../../auth/auth-helper";
import {list} from "../layer/LayerAPI";
import {readSpecs} from "../layer/LayerSpecsAPI";
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";


const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibWFzb3VkMTIzIiwiYSI6ImNqNTd2OGMwNTE0cm4ycW9hZHY4OTl1M3cifQ.3x-EMOwB6lyHZqYF0eyZFw'
});

const CreateFeature = (props) => {


  const user = auth.getToken();
  const jwt = auth.isAuthenticated();


  const [layers, setLayers] = useState([]);
  const [layerSpecs, setLayerSpecs] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [layer, setLayer] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [values, setValues] = useState({
    name: '',
    layerID: '',
    userID: '',
    geometry: {
      type: '',
      coordinates: []
    },
    attribute: [{
      name: '',
      value: ''
    }],
    error: ''
  });

  const onDrawCreate = async ({ features }) => {
    if(features[0].type == 'Point'){
      const tempCoordinate = features[0].geometry.coordinates;
      const tempGeometry = {type: features[0].type, coordinates: tempCoordinate};
      setGeometry(tempGeometry)
    }else{
      let tempGeometry = await features[0].geometry;
      setGeometry(tempGeometry);
    }
  };

  const onDrawUpdate = async ({ features }) => {
    let tempGeometry = await features[0].geometry;
    setGeometry(tempGeometry);
  };


  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setLayers(response);
      }
    })
  },[]);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  };

  const handleAttribute = (event) =>{

    setLayer(event.target.value);

    const abortController = new AbortController();
    const signal = abortController.signal;

    readSpecs({
      layerId: event.target.value
    }, {t: jwt.token}, signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setLayerSpecs(response);
      }
    }).catch(error=>{
      console.log(error);
    })

  };

  const handleAttValue = async (name, event, index) =>{

    const tempAttributes = [...attributes];
    tempAttributes[index] = {name: name, value: event.target.value};
    await setAttributes(tempAttributes);

  };

  const clickSubmit = () => {
    console.log(values.layerID);
    const feature = {
      name: values.name || undefined,
      layerID: layer || undefined,
      userID: user._id || undefined,
      geometry: geometry || undefined,
      attribute: attributes || undefined,
    };

    create(feature).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error});
        toast.error('اطلاعات وارد شده نادرست است')
      } else {
        setValues({ ...values, error: ''});
        toast.success('عملیات با موفقیت انجام شد', {
          onClose : () => props.history.push('/features')
        });
      }
    })
  };


  return (
    <React.Fragment>
    <div className="animated fadeIn">
      <ToastContainer
        rtl={true}
        autoClose={1500}
      />

      <Row>
        <Col lg='12'>
          <Card>
            <CardHeader>
              <h6>اضافه کردن عارضه</h6>
            </CardHeader>
            <CardBody>
              <Row xs={12}>
                <Col xs='4'>
                  <FormGroup>
                    <Label>نام</Label>
                    <Input
                      type='text'
                      id='name'
                      placeholder='نام عارضه را وارد کنید.'
                      required
                      value={values.name}
                      onChange={handleChange('name')}
                    />
                  </FormGroup>
                </Col>
                <Col xs='2'>
                  <FormGroup>
                    <Label>نام لایه</Label>
                    <Input
                      type='select'
                      id='layer'
                      name='layer'
                      required
                      onChange={handleAttribute}
                    >
                      <option></option>
                      {
                        layers.map((item,index)=>(
                          <option value={item._id} key={item._id}>{item.name}</option>
                        ))
                      }
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              {
                layerSpecs.length > 0 ?
                  layerSpecs.map((item, index) => {
                    const inputID = `name ${item.name}`;
                    return (
                      <Row xs={3} key={index}>
                        <Col xs='3'>
                          <FormGroup>
                            <Label>{item.name}</Label>
                            <Input
                              type='text'
                              id={inputID}
                              required
                              value={values.attribute.value}
                              onChange={(event) => handleAttValue(item.name, event, index)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )
                  })
                  : null
              }
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              تعیین موقعیت مکانی
            </CardHeader>
            <CardBody>
              <Map
                style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
                center={[53.6880, 32.4279]}
                zoom={[4]}
                containerStyle={{
                  height: "400px",
                  width: "100%",
                  contentAlign: 'center',

                }}
              >
                <DrawControl onDrawCreate={onDrawCreate} onDrawUpdate={onDrawUpdate} />
              </Map>
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
    </React.Fragment>

      )
}

export default CreateFeature;
