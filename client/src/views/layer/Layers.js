import React, { useEffect,useState } from 'react';
import {Button, Card, CardBody, CardHeader, Col, Row, Spinner, Table} from 'reactstrap';
import auth from '../../auth/auth-helper';
import {list, remove} from '../../views/layer/LayerAPI';
import {removeLayerSpecs} from "./LayerSpecsAPI";
import {Link} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayerSpecs from "./LayerSpecs";


const Layers = (props) =>{

  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [layers, setLayers] = useState([]);
  const [layerId, setLayerId] = useState(null);

  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setLayers(response);
        setLoading(false);
      }
    })
  },[]);

  const deleteLayer = async (id,index)=>{

    await removeLayerSpecs({layerId: id}).then((response)=>{
      console.log(response);
    }).catch(err=>{
      console.log(err);
    });

    await remove({
      layerId: id
    }).then((response)=>{
      const tempLayers = [...layers];
      tempLayers.splice(index,1);
      setLayers(tempLayers)
    })
  };

  const toggleLarge =() =>{
    setModal(!modal);
  };

  const showModal =(id) =>{
    setModal(true);
    setLayerId(id)
  };


  return(
    <div className="animated fadeIn">
      <ToastContainer rtl/>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              {
                loading ? <center><Spinner/></center> :
                  <Table responsive hover>
                    <thead>
                    <tr>
                      <th scope="col">شناسه لایه</th>
                      <th scope="col">نام</th>
                      <th scope="col">هندسه</th>
                      <th scope="col">کاربر ایجادکننده</th>
                      <th scope="col">تاریخ</th>
                      <th scope="col">تاریخ ویرایش</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      layers.length > 0 ?
                        layers.map((item, index)=>{
                          const layerProfile = `/layers/${item._id}`;
                          const createdDate = new Date(item.createdAt).toLocaleDateString('fa-IR');
                          const updatedDate = new Date(item.updatedAt).toLocaleDateString('fa-IR');

                          return(
                            <tr key={item._id}>
                              <td>
                                {item._id ? item._id : "***"}
                              </td>
                              <td>
                                {item.name ? item.name : "***"}
                              </td>
                              <td>
                                {item.geometry ? item.geometry : "***"}
                              </td>
                              <td>
                                {item.user ? item.user : "***"}
                              </td>
                              <td>
                                { item.createdAt ? createdDate : "***"}
                              </td>
                              <td>
                                { item.updatedAt ? updatedDate : "***"}
                              </td>
                              <td>
                                <div style={{display:'flex',justifyContent:'space-evenly'}}>
                                  <Button size="sm" color="info" onClick={()=> showModal(item._id)}>
                                    توضیحات
                                  </Button>
                                  <Link to={layerProfile}>
                                    <Button size="sm" color="primary">
                                      ویرایش
                                    </Button>
                                  </Link>
                                  <Button size="sm" color="danger" onClick={()=>deleteLayer(item._id, index)}>
                                    حذف
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
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
        modal ? <LayerSpecs
          modal={modal}
          toggleLarge={toggleLarge}
          layerId={layerId}
        /> : null
      }
    </div>
  )
};

export default Layers;
