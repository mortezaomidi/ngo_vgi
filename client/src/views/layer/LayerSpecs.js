import React, {useEffect, useState} from 'react';

import {
  Card,
  Input,
  Spinner, Col, ModalHeader, ModalBody, Modal, Row
} from 'reactstrap';

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {readSpecs} from "./LayerSpecsAPI";
import auth from "../../auth/auth-helper";
import classes from './layer.module.css';

const LayerSpecs = (props) => {

  const [loading, setLoading] = useState(true);
  const [arrayHolder, setArrayHolder] = useState([]);
  const [layerSpecs, setLayerSpecs] = useState([]);

  const jwt = auth.isAuthenticated();
  const {modal,toggleLarge, layerId} = props;


  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;

    readSpecs({
      layerId: layerId
    }, {t: jwt.token}, signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setLayerSpecs(response);
        setLoading(false);
      }
    }).catch(error=>{
      console.log(error);
    })
  },[]);


  return (
    <div className="animated fadeIn">
      <ToastContainer rtl/>
      <Card>
        <Modal isOpen={modal}
               toggle={toggleLarge}
               className={'modal-sm ' + props.className}
        >
          <ModalHeader toggle={toggleLarge}>
            <Row>
              <Col xs="12">
                توضیحات لایه
              </Col>
            </Row>
          </ModalHeader>
          <ModalBody>
            <div className={classes.layerSpecsSection}>
              {
                loading ? <Spinner/> : layerSpecs.length > 0 ?
                  layerSpecs.map((item)=>(
                    <div key={item._id}>
                      <Card className={classes.layerSpecsCard}>{item.name}</Card>
                    </div>
                  )) : 'توضیحاتی برای لایه موردنظر وجود ندارد.'
              }
            </div>
          </ModalBody>
        </Modal>
      </Card>
    </div>
  )
};

export default LayerSpecs;
