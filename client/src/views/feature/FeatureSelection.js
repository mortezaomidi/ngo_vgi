
import React, { useEffect,useState } from 'react';
import {Button, Card, CardBody, CardHeader, Col, Row, Spinner, Table} from 'reactstrap';

import {Link} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {listFeature, remove} from "./FeatureAPI";
import {list} from '../layer/LayerAPI';
import auth from "../../auth/auth-helper";
import FeatureDetails from "./FeatureDetails";


const FeatureSelection = (props) =>{

  const user = auth.getToken();
  const jwt = auth.isAuthenticated();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [featureId, setFeatureId] = useState(null);
  const [featureName, setFeatureName] = useState(null);
  const [layers, setLayers] = useState([]);
  const [modal, setModal] = useState(false);


  const toggleLarge =() =>{
    setModal(!modal);
  };

  const showModal =(id, name) =>{
    setModal(true);
    setFeatureId(id);
    setFeatureName(name);
  };

  const removeFeature = async (id,index)=>{
    await remove({
      featureId: id
    }).then((response)=>{
      const tempFeatures = [...features];
      tempFeatures.splice(index,1);
      setFeatures(tempFeatures);
    })
  };

  const validateItem = (id) =>{
    const tempFeatures = [...features];
    for (let index = 0 ; index < tempFeatures.length; index++){
      if(tempFeatures[index]._id == id){
        console.log(features[index].valid);
        tempFeatures[index].valid = true;
        setFeatures(tempFeatures);
      }
    }
  };

  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;

    listFeature(signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setFeatures(response);
        setLoading(false);
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

  },[]);

  const layerName = (layerId) =>{
    for (let index = 0 ; index < layers.length; index++){
      if(layers[index]._id == layerId){
        return layers[index].name;
      }
    }
  };

  return(
    <div className="animated fadeIn">
      <ToastContainer rtl/>
      <Row>
        <Col lg={12}>
            <Card>
              <CardHeader>
                {props.name}
              </CardHeader>
              <CardBody>
                {
                  loading && layers.length > 0 ? <center><Spinner/></center> :
                    <Table responsive hover>
                      <thead>
                      <tr>
                        <th scope="col">شناسه عارضه</th>
                        <th scope="col">نام</th>
                        <th scope="col">نام لایه</th>
                        <th scope="col">هندسه</th>
                        <th scope="col">کاربر ایجادکننده</th>
                        <th scope="col">وضعیت</th>
                        <th scope="col">تاریخ ایجاد</th>
                        <th scope="col">تاریخ ویرایش</th>
                        <th scope="col">عملیات</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        features.length > 0 ?
                          features.map((item, index)=>{
                            let layerId = item.layerID;
                            const featureProfile = `/features/${item._id}`;
                            const createdDate = new Date(item.createdAt).toLocaleDateString('fa-IR');
                            const updatedDate = new Date(item.updatedAt).toLocaleDateString('fa-IR');

                            if(item.geometry.type == 'Point' && props.type === "Point"){

                              return(
                                <tr key={item._id}>
                                  <td>
                                    {item._id ? item._id : "***"}
                                  </td>
                                  <td>
                                    {item.name ? item.name : "***"}
                                  </td>
                                  <td>
                                    {layerName(layerId) ? layerName(layerId) : "***"}
                                  </td>
                                  <td>
                                    {item.geometry.type ? item.geometry.type : "***"}
                                  </td>
                                  <td>
                                    {item.userID ? item.userID : "***"}
                                  </td>
                                  <td>
                                    {item.valid == true ? 'معتبر' : 'نامعتبر'}
                                  </td>
                                  <td>
                                    { item.createdAt ? createdDate : "***"}
                                  </td>
                                  <td>
                                    { item.updatedAt ? updatedDate : "***"}
                                  </td>
                                  <td>
                                    <div style={{display:'flex',justifyContent:'space-evenly'}}>
                                      <Button size="sm" color="success" onClick={()=>validateItem(item._id)}>
                                        تایید
                                      </Button>
                                      <Button size="sm" color="info" onClick={()=> showModal(item._id, item.name)}>
                                        توضیحات
                                      </Button>
                                      <Link to={featureProfile}>
                                        <Button size="sm" color="primary">
                                          ویرایش
                                        </Button>
                                      </Link>
                                      <Button size="sm" color="danger" onClick={()=>removeFeature(item._id, index)}>
                                        حذف
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            }else if (item.geometry.type == 'LineString' && props.type === "LineString"){

                              return(
                                <tr key={item._id}>
                                  <td>
                                    {item._id ? item._id : "***"}
                                  </td>
                                  <td>
                                    {item.name ? item.name : "***"}
                                  </td>
                                  <td>
                                    {layerName(layerId) ? layerName(layerId) : "***"}
                                  </td>
                                  <td>
                                    {item.geometry.type ? item.geometry.type : "***"}
                                  </td>
                                  <td>
                                    {item.userID ? item.userID : "***"}
                                  </td>
                                  <td>
                                    {item.valid == true ? 'معتبر' : 'نامعتبر'}
                                  </td>
                                  <td>
                                    { item.createdAt ? createdDate : "***"}
                                  </td>
                                  <td>
                                    { item.updatedAt ? updatedDate : "***"}
                                  </td>
                                  <td>
                                    <div style={{display:'flex',justifyContent:'space-evenly'}}>
                                      <Button size="sm" color="success" onClick={()=>validateItem(item._id)}>
                                        تایید
                                      </Button>
                                      <Button size="sm" color="info" onClick={()=> showModal(item._id, item.name)}>
                                        توضیحات
                                      </Button>
                                      <Link to={featureProfile}>
                                        <Button size="sm" color="primary">
                                          ویرایش
                                        </Button>
                                      </Link>
                                      <Button size="sm" color="danger" onClick={()=>removeFeature(item._id, index)}>
                                        حذف
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            }else if (item.geometry.type == 'Polygon' && props.type === "Polygon"){

                              return(
                                <tr key={item._id}>
                                  <td>
                                    {item._id ? item._id : "***"}
                                  </td>
                                  <td>
                                    {item.name ? item.name : "***"}
                                  </td>
                                  <td>
                                    {layerName(layerId) ? layerName(layerId) : "***"}
                                  </td>
                                  <td>
                                    {item.geometry.type ? item.geometry.type : "***"}
                                  </td>
                                  <td>
                                    {item.userID ? item.userID : "***"}
                                  </td>
                                  <td>
                                    {item.valid == true ? 'معتبر' : 'نامعتبر'}
                                  </td>
                                  <td>
                                    { item.createdAt ? createdDate : "***"}
                                  </td>
                                  <td>
                                    { item.updatedAt ? updatedDate : "***"}
                                  </td>
                                  <td>
                                    <div style={{display:'flex',justifyContent:'space-evenly'}}>
                                      <Button size="sm" color="success" onClick={()=>validateItem(item._id)}>
                                        تایید
                                      </Button>
                                      <Button size="sm" color="info" onClick={()=> showModal(item._id, item.name)}>
                                        توضیحات
                                      </Button>
                                      <Link to={featureProfile}>
                                        <Button size="sm" color="primary">
                                          ویرایش
                                        </Button>
                                      </Link>
                                      <Button size="sm" color="danger" onClick={()=>removeFeature(item._id, index)}>
                                        حذف
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            }
                          }) : null
                      }
                      </tbody>
                    </Table>
                }
              </CardBody>
            </Card>
        </Col>
      </Row>
      {
        modal ? <FeatureDetails
          modal={modal}
          toggleLarge={toggleLarge}
          featureId={featureId}
          featureName={featureName}
        /> : null
      }
    </div>

  )
};

export default FeatureSelection;
