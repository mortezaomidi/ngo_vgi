import React, {useEffect, useState} from 'react'

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Row, Table } from "reactstrap";
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import classes from './map.module.css';
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";
import {listFeature} from "../feature/FeatureAPI";
import PointDisplay from './PointDisplay';
import LineStringDisplay from './LineStringDisplay';
import PolygonDisplay from "./PolygonDisplay";


let map;
let draw;


mapboxgl.accessToken = 'pk.eyJ1IjoibWFzb3VkMTIzIiwiYSI6ImNqNTd2OGMwNTE0cm4ycW9hZHY4OTl1M3cifQ.3x-EMOwB6lyHZqYF0eyZFw';


const MapDisplay = (props) => {

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [options,setOptions] = useState({
    lat:27.85380233830591,
    lng: 78.37183893820759,
    zoom: 5,
  });


  useEffect(()=>{

    const abortController = new AbortController();
    const signal = abortController.signal;

    listFeature(signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setFeatures(response);
        setLoading(true);
      }
    });


// map.on('draw.create', createArea);
// map.on('draw.delete', deleteArea);
// map.on('draw.update', updateArea);

  },[]);

  useEffect(()=>{

    map = new mapboxgl.Map({
      container: document.getElementById('mapDiv'),
      style: 'mapbox://styles/mapbox/streets-v11',
      sprite: "mapbox://sprites/mapbox/bright-v8",
      center: [51.41232563976638, 35.706611931863875],
      zoom: 5,
      attributionControl: false

    });

    draw = new MapboxDraw({
      displayControlsDefault: true,
    });

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(draw);

    PointDisplay(loading, features, map);
    LineStringDisplay(loading, features, map);
    PolygonDisplay(loading, features, map);

  });

  return(
    <div className="animated fadeIn">
      <ToastContainer
        rtl={true}
        autoClose={1500}
      />
      <Card>
        <CardBody>
          <div>
            <div id='mapDiv' className={classes.mapContainer}></div>
          </div>
        </CardBody>
      </Card>
    </div>
  )

};

export default MapDisplay;
