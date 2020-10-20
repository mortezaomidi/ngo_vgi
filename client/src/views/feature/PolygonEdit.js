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



const PolygonEdit = (features) =>{

  const mapContainer = useRef(null);

  useEffect(()=>{
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      sprite: "mapbox://sprites/mapbox/bright-v8",
      center: [features.features.geometry.coordinates[0][0][0], features.features.geometry.coordinates[0][0][1]],
      zoom: 9,
      attributionControl: false

    });

    draw = new MapboxDraw({
      displayControlsDefault: false,

    });

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(draw);

    const canvas = map.getCanvasContainer();

    const updateFeature = (e) =>{
      let data = draw.getAll();

      features.features.geometry.coordinates = data.features[0].geometry.coordinates;

      const mapSource = map.getSource(`${features.features.layerID}`);

      if(typeof mapSource !== 'undefined') {

        if (typeof mapSource._data.features !== 'undefined'){

          mapSource.setData(data);
        }

      }else {

        map.addSource(`${features.features.layerID}`, {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [{'type':'Feature', 'geometry': {'type': features.features.geometry.type, 'coordinates': features.features.geometry.coordinates}, 'properties': {}}]
          }
        });
      }
    };


    map.on('load', function () {
      features ?
        map.loadImage(
          marker,
          function (error, image) {
            if (error) throw error;

              let featureIds = draw.add({'id': features.features.layerID, 'type':'Feature', 'properties': {}, 'geometry': {'type': features.features.geometry.type, 'coordinates': features.features.geometry.coordinates}});
              draw.modes.DIRECT_SELECT === 'direct_select';

            map.on('click', `${features.features.layerID}`, function (e) {
              let feature = map.queryRenderedFeatures(e.point);
              // let ids = draw.add(feature);
              console.log(feature);

            });

            map.on('draw.update', updateFeature)

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
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PolygonEdit;
