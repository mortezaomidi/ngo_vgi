import React, {useEffect, useState} from "react";
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
import {create, read, update} from "./LayerAPI";
import {readSpecs, createSpecs, removeSpecs} from  "./LayerSpecsAPI";
import {Link} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './layer.module.css';
import CIcon from "@coreui/icons-react";


const EditLayer = (props) => {

  const {layerId} = props.match.params;
  const user = auth.getToken();
  const jwt = auth.isAuthenticated();

  const [loading, setLoading] = useState(true);
  const [specs, setSpecs] = useState({
    name: '',
    layer: '',
    error: '',
  });
  const [layerSpecs, setLayerSpecs] = useState([]);
  const [layer, setLayer] = useState({
    name: '',
    user: '',
    geometry: '',
    error: '',
  });


  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({
      layerId: layerId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setLayer({...layer, error: data.error})
      } else {
        setLayer({...layer, name: data.name, user: data.user, geometry: data.geometry});
      }
    });

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
    });

    return function cleanup(){
      abortController.abort()
    }

  }, [layerId]);

  const clickSubmit = () => {

    const layers = {
      name: layer.name || undefined,
      user: user._id || undefined,
      geometry: layer.geometry || undefined
    };

    update({
      layerId: layerId
    }, layers).then((data) => {
      if (data && data.error) {
        toast.error('خطا در برقراری ارتباط');
        setLayer({...layer, error: data.error})
      } else {
        setLayer({...layer, layerId: data._id});
        toast.success('عملیات با موفقیت انجام شد', {
          onClose : () => props.history.push('/layers')
        });
      }
    })

  };

  const clickCreateSpecs = () =>{
    const spec = {
      name: specs.name || undefined,
      layer: layerId || undefined,
    };
    createSpecs({layerId: layerId}, spec).then((data) => {
      if (data.error) {
        setSpecs({ ...specs, error: data.error});
        toast.error('اطلاعات وارد شده نادرست است')
      } else {

        setSpecs({ ...specs, error: ''});
        const abortController = new AbortController();
        const signal = abortController.signal;
        readSpecs({
          layerId: layerId
        }, {t: jwt.token}, signal).then((response)=>{
          if (response.error) {
            console.log(response.error)
          } else {
            setLayerSpecs(response);
          }
        }).catch(error=>{
          console.log(error);
        });

        toast.success('عملیات با موفقیت انجام شد');

      }
    })
  };

  const layerHandleChange = name => event => {
    setLayer({...layer, [name]: event.target.value})
  };

  const specsHandleChange = name => event => {
    setSpecs({...specs, [name]: event.target.value})
  };



  const deleteSpecs = (id,index)=>{
    removeSpecs({
      layerSpecsId: id
    }).then((response)=>{
      const tempLayerSpecs = [...layerSpecs];
      tempLayerSpecs.splice(index,1);
      setLayerSpecs(tempLayerSpecs)
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
          <h6>ویرایش اطلاعات لایه</h6>
        </CardHeader>
        <CardBody>
          <FormGroup row className="my-0">
            <Col xs="3">
              <FormGroup>
                <Label htmlFor="name">نام لایه</Label>
                <Input
                  type="text"
                  id="title"
                  value={layer.name}
                  onChange={layerHandleChange('name')}
                  placeholder= {layer.name}
                  required
                />
              </FormGroup>
            </Col>
            <Col xs="3">
              <FormGroup>
                <Label htmlFor="label">هندسه</Label>
                <Input
                  type="select"
                  id="geometry"
                  value={layer.geometry}
                  onChange={layerHandleChange('geometry')}
                  placeholder= {layer.geometry}
                  required
                >
                  <option value='Point'>نقطه</option>
                  <option value='Line'>خط</option>
                  <option value='Polygon'>پلیگون</option>
                </Input>
              </FormGroup>
            </Col>
          </FormGroup>
          <Row>
            <Col xs="4">
              <FormGroup>
                <Label htmlFor="name">نام اطلاعات توصیفی</Label>
                <Input
                  type="text"
                  id="layerSpecsName"
                  value={specs.name}
                  onChange={specsHandleChange('name')}
                  placeholder= 'نام اطلاعات توصیفی موردنظر را وارد کنید'
                  required
                />
              </FormGroup>
            </Col>
            <Button type="submit" size="sm" color="success" className={classes.buttonStyle} onClick={()=>clickCreateSpecs()}>
              <strong>ایجاد</strong>
            </Button>
          </Row>
          <div className={classes.layerSpecsSection}>
              {
                layerSpecs.map((item, index) =>(
                  <div key={item._id} className={classes.media}>
                    <span className={classes.removeIconsPicturesProduct} onClick={()=>deleteSpecs(item._id, index)}>
                      <CIcon name="cil-x" size="sm"/>
                    </span>
                    <span className={classes.buttonSpecsStyle}>
                      {item.name}
                    </span>
                  </div>
                ))
              }
          </div>
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
export default EditLayer;

