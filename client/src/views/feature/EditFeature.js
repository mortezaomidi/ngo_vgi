import React, {useEffect, useState, useRef} from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Table
} from "reactstrap";
import auth from "../../auth/auth-helper";
import {readFeature, update} from "./FeatureAPI";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CIcon from "@coreui/icons-react";
import {list, read} from '../layer/LayerAPI';
// import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";
import classes from './feature.module.css';
import TestComponent from "../test/TestComponent";
import PointEdit from "./PointEdit";
import LineEdit from "./LineEdit";
import PolygonEdit from "./PolygonEdit";

//
// const Map = ReactMapboxGl({
//   accessToken: 'pk.eyJ1IjoibWFzb3VkMTIzIiwiYSI6ImNqNTd2OGMwNTE0cm4ycW9hZHY4OTl1M3cifQ.3x-EMOwB6lyHZqYF0eyZFw',
//
// });

let map;
let draw;

mapboxgl.accessToken = 'pk.eyJ1IjoibWFzb3VkMTIzIiwiYSI6ImNqNTd2OGMwNTE0cm4ycW9hZHY4OTl1M3cifQ.3x-EMOwB6lyHZqYF0eyZFw';

const EditFeature = (props) => {

  const {featureId} = props.match.params;
  const user = auth.getToken();
  const jwt = auth.isAuthenticated();

  // const mapContainer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]);
  const [latLong, setLatLong] = useState({lng:'', lat:''});
  const [features, setFeatures] = useState({
    name: '',
    geometry: {
      type: '',
      coordinates: []
    },
    valid: false,
    layerID: '',
    userID: '',
    attribute: [{
      name: '',
      value: ''
    }],
    error: '',
  });
  const [layers, setLayers] = useState([]);
  const [geometry, setGeometry] = useState({});

  //
  // const onDrawCreate = async ({ features }) => {
  //   console.log(features);
  //   if(features[0].type == 'Point'){
  //     const tempCoordinate = features[0].geometry.coordinates;
  //     const tempGeometry = {type: features[0].type, coordinates: tempCoordinate};
  //     setGeometry(tempGeometry);
  //   }else{
  //     let tempGeometry = await features[0].geometry;
  //     setGeometry(tempGeometry);
  //   }
  // };
  //
  // const onDrawUpdate = async ({ features }) => {
  //   let tempGeometry = await features[0].geometry;
  //   setGeometry(tempGeometry);
  // };

  const onDragEnd  =  async (event) => {
    const tempCoordinate = [event.lngLat.lng, event.lngLat.lat];
    const tempGeometry = {type: features.geometry.type, coordinates: tempCoordinate};
    await setGeometry(tempGeometry);
    console.log(tempGeometry);
  };


  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    readFeature({
      featureId: featureId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setFeatures({...features, error: data.error})
      } else {
        setFeatures({...features, name: data.name, geometry: data.geometry, valid: data.valid, layerID: data.layerID, userID: data.userID, attribute: data.attribute });
        setGeometry(data.geometry);
      }
    });


    list(signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setLayers(response);
        setLoading(false);
      }
    });

  }, []);


  const featureHandleChange = name => event => {
    setFeatures({...features, [name]: event.target.value})
  };

  const tempAttributes = [...features.attribute];
  // setAttributes(tempAttributes);

  const featureSpecsHandleChange = async (name, index, event) => {
    tempAttributes[index].name = name;
    tempAttributes[index].value = event.target.value;
    setAttributes(tempAttributes);

  };

  const clickSubmit = () => {

    const feature = {
      name: features.name,
      geometry: geometry,
      valid: features.valid,
      layerID: features.layerID,
      userID: user._id,
      attribute: tempAttributes,
      error: '',
    };

    update({
      featureId: featureId
    }, feature).then((data) => {
      if (data && data.error) {
        toast.error('خطا در برقراری ارتباط');
        setFeatures({...features, error: data.error})
      } else {
        setFeatures({...features, featureId: featureId});
        toast.success('عملیات با موفقیت انجام شد', {
          onClose : () => props.history.push('/features')
        });
      }
    })

  };


  return (
    <div className="animated fadeIn">
      <ToastContainer
        rtl={true}
        autoClose={500}
      />
      <Card>
        <CardHeader>
          <h6>ویرایش اطلاعات عارضه</h6>
        </CardHeader>
        <CardBody>
          <FormGroup row className="my-0">
            <Col xs="3">
              <FormGroup>
                <Label htmlFor="name">نام عارضه</Label>
                <Input
                  type="text"
                  id="title"
                  value={features.name}
                  onChange={featureHandleChange('name')}
                  placeholder= {features.name}
                  required
                />
              </FormGroup>
            </Col>
            <Col xs="3">
              <FormGroup>
                <Label htmlFor="label">لایه</Label>
                <Input
                  type="select"
                  id="layer"
                  disabled={true}
                  value={features.layerID}
                  onChange={featureHandleChange('layerID')}
                  required
                >
                  {
                    layers.length > 0 ?
                        layers.map((item, index) =>(
                          <option key={index} value={item._id}>{item.name}</option>
                        ))
                      :  null
                  }
                </Input>
              </FormGroup>
            </Col>
          </FormGroup>

          <Row xs={12}>
            <Col>
              <h6>اطلاعات توصیفی</h6>
            </Col>
          </Row>
          {
            loading ? <Spinner/> :
              features.attribute.map((item,index)=>{
                const inputID = `name ${item.name}`;
                return(
                  <Row key={index}>
                    <Col xs={4}>
                      <Card className={classes.featureSpecsEdit} style={{backgroundColor:'#bcbcbc'}}><i>{item.name}</i></Card>
                    </Col>
                    <Col xs={6}>
                      <FormGroup>
                        <Input
                          type="text"
                          id= {inputID}
                          value= {item.value}
                          required
                          onChange = {(event) => featureSpecsHandleChange(item.name, index, event)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )
              })
          }
          <br/>
          <Row xs={12}>
            <Col>
              <h6>موقعیت مکانی</h6>
            </Col>
          </Row>
          {
            loading ? <Spinner/> :
              features.geometry.type  ?
                features.geometry.type == "Point" && geometry.coordinates ?
                    <PointEdit features={features}/>
                  : features.geometry.type == "LineString" && geometry.coordinates ?
                      <LineEdit features={features}/>

                  : features.geometry.type == "Polygon" && geometry.coordinates ?
                      <PolygonEdit features={features}/>

                    // <Map
                    //   style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
                    //   sprite= "mapbox://sprites/mapbox/bright-v9"
                    //   center={[features.geometry.coordinates[0][0][0], features.geometry.coordinates[0][0][1]]}
                    //   zoom={[5]}
                    //   containerStyle={{
                    //     height: "300px",
                    //     width: "60%",
                    //     margin: "auto",
                    //
                    //     contentAlign: 'center',
                    //
                    //   }}
                    //
                    // >
                    //   <Layer
                    //     type="fill"
                    //     fill-color="#b02007"
                    //   >
                    //     <Feature
                    //       coordinates={[features.geometry.coordinates[0]]}
                    //       // onClick={onMouseClick}
                    //       // draggable={draggable}
                    //
                    //       onDragEnd={(event)=>console.log(event)}
                    //     />
                    //   </Layer>
                    //
                    // </Map>
                    : null

                : null



          }

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
export default EditFeature;

