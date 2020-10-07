import React, { useEffect,useState } from 'react';
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import FeatureSelection from "./FeatureSelection";
import LayerSpecs from "../layer/LayerSpecs";
import {ToastContainer} from "react-toastify";



const Features = (props) =>{

  return(
    <React.Fragment>
      <FeatureSelection name="عوارض نقطه ای" type="Point"/>
      <FeatureSelection name="عوارض خطی" type="LineString"/>
      <FeatureSelection name="عوارض سطحی" type="Polygon"/>
    </React.Fragment>
  )
};

export default Features;
