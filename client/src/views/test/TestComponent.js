import React, {useEffect, useState, useRef} from 'react'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Row, Table } from "reactstrap";
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "../Map/mapbox-gl.css";
import "../Map/mapbox-gl-draw.css";
import classes from "../Map/map.module.css";


let map;
let draw;


mapboxgl.accessToken = 'pk.eyJ1IjoibWFzb3VkMTIzIiwiYSI6ImNqNTd2OGMwNTE0cm4ycW9hZHY4OTl1M3cifQ.3x-EMOwB6lyHZqYF0eyZFw';



const TestComponent = (props) =>{

  const mapContainer = useRef(null);

  useEffect(()=>{
    map = new mapboxgl.Map({
      container: mapContainer.current,
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
  }, []);

  return(
    <div className="animated fadeIn">
      <ToastContainer
        rtl={true}
        autoClose={1500}
      />
      <Card>
        <CardBody>
          <div>
            <div ref={mapContainer} className={classes.mapContainer}></div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default TestComponent;
