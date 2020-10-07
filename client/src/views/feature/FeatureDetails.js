import React, {useEffect, useState} from 'react';

import {
  Card,
  Input,
  Spinner, Col, ModalHeader, ModalBody, Modal, Row, Button, CardBody, Alert
} from 'reactstrap';

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import auth from "../../auth/auth-helper";
import classes from './feature.module.css';
import {readFeature} from './FeatureAPI';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";


const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibWFzb3VkMTIzIiwiYSI6ImNqNTd2OGMwNTE0cm4ycW9hZHY4OTl1M3cifQ.3x-EMOwB6lyHZqYF0eyZFw',
});

const FeatureDetails = (props) => {

  const [loading, setLoading] = useState(true);
  const [arrayHolder, setArrayHolder] = useState([]);
  const [feature, setFeature] = useState([]);
  const [featureSpecs, setFeatureSpecs] = useState([]);

  const jwt = auth.isAuthenticated();
  const {modal,toggleLarge, featureId, featureName} = props;


  const onDrawCreate = async ({ features }) => {
    console.log(features)
  };

  const onDrawUpdate = async ({ features }) => {
    console.log(features)
  };

  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;

    readFeature({
      featureId: featureId
    }, {t: jwt.token}, signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setFeature(response);
        setLoading(false);
      }
    }).catch(error=>{
      console.log(error);
    })
  },[]);

  const info = () => {
    feature.attribute.map((item,index)=>{
      console.log(item.name);
    })
  };

  return (
    <div className="animated fadeIn">
      <ToastContainer rtl/>
      <Card>
        <Modal isOpen={modal}
               toggle={toggleLarge}
               className={'modal-lg ' + props.className}
        >
          <ModalHeader toggle={toggleLarge}>
            <Row>
              <Col xs="12">
                <h5> نام عارضه :  {featureName} </h5>
              </Col>
            </Row>
          </ModalHeader>
          <ModalBody>
            <div>
              <div>
                <Row xs={12}>
                  <Col>
                    <h6>اطلاعات توصیفی</h6>
                  </Col>
                </Row>
                {
                  loading ? <Spinner/> :
                    feature.attribute.map((item,index)=>(
                      <Row key={index}>
                        <Col xs={4}>
                          <Card className={classes.featureSpecsCard} style={{backgroundColor:'#bcbcbc'}}><i>{item.name}</i></Card>
                        </Col>
                        <Col xs={8}>
                          <Card className={classes.featureSpecsCard}><b>{item.value}</b></Card>
                        </Col>
                      </Row>
                    ))
                }
                <br/>
                <Row xs={12}>
                  <Col>
                    <h6>موقعیت مکانی</h6>
                  </Col>
                </Row>
                {
                  loading ? <Spinner/> :
                    feature.geometry.type  ?
                      feature.geometry.type == "Point" ?
                        <Map
                          style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
                          sprite= "mapbox://sprites/mapbox/bright-v9"
                          center={[feature.geometry.coordinates[0], feature.geometry.coordinates[1]]}
                          zoom={[17]}
                          containerStyle={{
                            height: "300px",
                            width: "60%",
                            margin: "auto",

                            contentAlign: 'center',

                          }}

                        >
                          <Layer
                            type="symbol"
                            layout={{ "icon-image": "circle-15" }}
                          >
                            <Feature coordinates={[feature.geometry.coordinates[0], feature.geometry.coordinates[1]]}/>
                          </Layer>
                        </Map>
                        : feature.geometry.type == "LineString" ?

                        <Map
                          style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
                          sprite= "mapbox://sprites/mapbox/bright-v9"
                          center={[feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]]}
                          zoom={[15]}
                          containerStyle={{
                            height: "300px",
                            width: "60%",
                            margin: "auto",

                            contentAlign: 'center',

                          }}

                        >
                          <Layer
                            type="line"
                            line-color="#b02007"

                          >
                            <Feature coordinates={feature.geometry.coordinates}/>
                          </Layer>
                        </Map>
                        : feature.geometry.type == "Polygon" ?
                          <Map
                            style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
                            sprite= "mapbox://sprites/mapbox/bright-v9"
                            center={[feature.geometry.coordinates[0][0][0], feature.geometry.coordinates[0][0][1]]}
                            zoom={[15]}
                            containerStyle={{
                              height: "300px",
                              width: "60%",
                              margin: "auto",

                              contentAlign: 'center',

                            }}

                          >
                            <Layer
                              type="fill"
                              fill-color="#b02007"
                            >
                              <Feature coordinates={[feature.geometry.coordinates[0]]}/>
                            </Layer>
                          </Map>
                          : null

                      : null



                }
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Card>
    </div>
  )
};

export default FeatureDetails;
