import React, {useEffect, useState, useRef} from 'react'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Row, Table } from "reactstrap";
import mapboxgl, {Map} from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "../Map/mapbox-gl.css";
import "../Map/mapbox-gl-draw.css";
import classes from "./feature.module.css";
import marker from "../Map/marker.png";


let map;
let draw;


mapboxgl.accessToken = 'pk.eyJ1IjoibWFzb3VkMTIzIiwiYSI6ImNqNTd2OGMwNTE0cm4ycW9hZHY4OTl1M3cifQ.3x-EMOwB6lyHZqYF0eyZFw';



const PointEdit = (features) =>{

  const mapContainer = useRef(null);

  useEffect(()=>{
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      sprite: "mapbox://sprites/mapbox/bright-v8",
      center: features.features.geometry.coordinates,
      zoom: 13,
      attributionControl: false

    });

    draw = new MapboxDraw({
      displayControlsDefault: false,

    });

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(draw);

    const canvas = map.getCanvasContainer();

    function onMove(e) {
      let coords = e.lngLat;

      canvas.style.cursor = 'grabbing';

      features.features.geometry.coordinates = [coords.lng, coords.lat];
      map.getSource(`${features.features.layerID}`).setData({'type': 'FeatureCollection', 'features': [{'type':'Feature', 'geometry': {'type': features.features.geometry.type, 'coordinates': features.features.geometry.coordinates}}]});
    }

    function onUp(e) {
      let coords = e.lngLat;

      map.off('mousemove', onMove);
      map.off('touchmove', onMove);
    }


    map.on('load', function () {
      features ?
        map.loadImage(
          marker,
          function (error, image) {
            if (error) throw error;
            map.addImage('custom-marker', image);
            map.addSource(`${features.features.layerID}`, {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': [{'type':'Feature', 'geometry': {'type': features.features.geometry.type, 'coordinates': features.features.geometry.coordinates}}]
              }
            });
            map.addLayer({
              'id': features.features.layerID ,
              'type': 'symbol',
              'source': features.features.layerID ,
              'layout': {
                'icon-image': 'custom-marker',
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
              }

            });

            map.on('mouseenter', `${features.features.layerID}` , function () {
              canvas.style.cursor = 'move';
            });

            map.on('mouseleave', `${features.features.layerID}` , function () {
              canvas.style.cursor = '';
            });

            map.on('mousedown', `${features.features.layerID}` , function (e) {
              e.preventDefault();
              canvas.style.cursor = 'grab';
              map.on('mousemove', onMove);
              map.once('mouseup', onUp);
            });

            map.on('touchstart', `${features.features.layerID}` , function (e) {
              if (e.points.length !== 1) return;
              e.preventDefault();
              map.on('touchmove', onMove);
              map.once('touchend', onUp);
            });

          })

        : null
    });

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
            <pre id="coordinates" className={classes.coordinates}></pre>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PointEdit;
