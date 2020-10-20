import React, {useEffect, useState} from 'react'
import marker from "./marker.png";
import mapboxgl from "mapbox-gl";
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";


const LineStringDisplay = (loading, features, map) =>{

  const layerIDs = [];

  map.on('load', function () {
    loading && features.length > 0 ?
      map.loadImage(
        marker,
        function (error, image) {
          if (error) throw error;
          // map.addImage('custom-marker', image);
          //
          // features.map((item,index)=>{
          // });

          features.map((item, index)=>{

            if(item.geometry.type == 'LineString'){
              const description  =
                `
              <div style="margin-bottom: -21px; background-color: #ffffff">نام عارضه : <strong>${item.name}</strong></div>
              <Table class="table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col" style="padding: 3px">نام</th>
                    <th scope="col" style="padding: 3px">مقدار</th>
                  </tr>
                </thead>
              <tbody>`;

              const att =  item.attribute.map((attribute, idx)=>{
                return(
                  `<tr key=${idx}>
                  <td style="padding: 3px"><strong>${attribute.name.toString()}</strong></td>
                  <td style="padding: 3px">${attribute.value.toString()}</td>
                </tr>`
                )
              });
              const attJoin = att.join();


              const reminder = `</tbody></Table>`;

              let res = description.concat(attJoin, reminder);


              // feature = {'type':'Feature', 'geometry': {'type': item.geometry.type, 'coordinates': item.geometry.coordinates}, 'properties': {'description': res}};

              // featureCollection[index] = feature;

              // console.log(featureCollection[index]);

              layerIDs.push(item.layerID);


              for(let i = 0; i < layerIDs.length; i++){

                if(layerIDs[i] == item.layerID){

                  const mapSource = map.getSource(`${item.layerID}`);

                  if(typeof mapSource !== 'undefined') {
                    let sourceFeature = mapSource._data.features;

                    if (typeof mapSource._data.features !== 'undefined'){
                      sourceFeature.push({'type':'Feature', 'geometry': {'type': item.geometry.type, 'coordinates': item.geometry.coordinates}, 'properties': {'description': res}});
                      let geojson = {
                        "type": "FeatureCollection",
                        "features": sourceFeature
                      };
                      mapSource.setData(geojson);
                    }

                  }else {

                    map.addSource(`${item.layerID}`, {
                      'type': 'geojson',
                      'data': {
                        'type': 'FeatureCollection',
                        'features': [{'type':'Feature', 'geometry': {'type': item.geometry.type, 'coordinates': item.geometry.coordinates}, 'properties': {'description': res}}]
                      }
                    });
                  }

                }
              }
            }

          });

          function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }

          const unique = layerIDs.filter(onlyUnique);

          for(let index = 0; index < unique.length; index++){

          map.addLayer({
            'id': unique[index] ,
            'type': 'line',
            'source': unique[index] ,
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': `rgb(${Math.floor(Math.random() * (254 - 1 + 1) ) + 1},${Math.floor(Math.random() * (254 - 1 + 1) ) + 1},${Math.floor(Math.random() * (254 - 1 + 1) ) + 1})`,
              'line-width': 2
            }
            // 'layout': {
            //   'icon-image': 'custom-marker',
            //   'text-offset': [0, 1.25],
            //   'text-anchor': 'top'
            // }

          });

              map.on('click', unique[index], function (e) {
                let coordinates = e.features[0].geometry.coordinates.slice();
                let description = e.features[0].properties.description;
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                const popup = new mapboxgl.Popup()
                  .setLngLat(e.lngLat)
                  .setHTML(description)
                  .addTo(map);

                // map.on('mouseleave', unique[index], function() {
                //   popup.remove();
                // });

              });




          }



          // const mapLayer = map.getLayer('hospital');
          //
          // if(typeof mapLayer !== 'undefined') {
          //   mapLayer.setData('hospital');
          // }
          // else{
          //
          //   map.addLayer({
          //     'id': 'hospital',
          //     'type': 'symbol',
          //     'source': 'hospital',
          //     'layout': {
          //       'icon-image': 'custom-marker',
          //       'text-font': [
          //         'Open Sans Semibold',
          //         'Arial Unicode MS Bold'
          //
          //       ],
          //       'text-offset': [0, 1.25],
          //       'text-anchor': 'top'
          //     }
          //   });
          //




        })

      : null
  });
};

export default LineStringDisplay;


