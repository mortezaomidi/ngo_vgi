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
import {readFeature, update} from "./FeatureAPI";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './feature.module.css';
import CIcon from "@coreui/icons-react";
import {list, read} from '../layer/LayerAPI';


const EditFeature = (props) => {
  return(
    <Card>این صفحه هنوز تکمیل نشده است</Card>

  )
  // const {featureId} = props.match.params;
  // const user = auth.getToken();
  // const jwt = auth.isAuthenticated();
  //
  // const [loading, setLoading] = useState(true);
  // const [features, setFeatures] = useState({
  //   name: '',
  //   geometry: {
  //     type: '',
  //     coordinates: []
  //   },
  //   valid: false,
  //   layerID: '',
  //   userID: '',
  //   attribute: [],
  //   error: '',
  // });
  // const [layers, setLayers] = useState([]);
  //
  // useEffect(() => {
  //   const abortController = new AbortController();
  //   const signal = abortController.signal;
  //
  //   readFeature({
  //     featureId: featureId
  //   }, {t: jwt.token}, signal).then((data) => {
  //     if (data && data.error) {
  //       setFeatures({...features, error: data.error})
  //     } else {
  //       setFeatures({...features, name: data.name, geometry: data.geometry, valid: data.valid, layerID: data.layerID, userID: data.userID, attribute: data.attribute });
  //     }
  //   });
  //
  //   list(signal).then((response)=>{
  //     if (response.error) {
  //       console.log(response.error)
  //     } else {
  //       setLayers(response);
  //       setLoading(false);
  //     }
  //   });
  //
  //
  //   return function cleanup(){
  //     abortController.abort()
  //   }
  //
  // }, []);
  //
  // const clickSubmit = () => {
  //
  //   const feature = {
  //     name: features.name,
  //     geometry: {
  //       type: "Point",
  //       coordinates: [0,0]
  //     },
  //     valid: features.valid,
  //     layerID: features.layerID,
  //     userID: features.userID,
  //     attribute: features.attribute,
  //     error: '',
  //   };
  //   console.log(feature);
  //
  //   update({
  //     featureId: featureId
  //   }, feature).then((data) => {
  //     if (data && data.error) {
  //       toast.error('خطا در برقراری ارتباط');
  //       setFeatures({...features, error: data.error})
  //     } else {
  //       setFeatures({...features, featureId: featureId});
  //       toast.success('عملیات با موفقیت انجام شد', {
  //         onClose : () => props.history.push('/features')
  //       });
  //     }
  //   })
  //
  // };
  //
  //
  // const featureHandleChange = name => event => {
  //   setFeatures({...features, [name]: event.target.value})
  // };
  //
  // return (
  //   <div className="animated fadeIn">
  //     <ToastContainer
  //       rtl={true}
  //       autoClose={500}
  //     />
  //     <Card>
  //       <CardHeader>
  //         <h6>ویرایش اطلاعات عارضه</h6>
  //       </CardHeader>
  //       <CardBody>
  //         <FormGroup row className="my-0">
  //           <Col xs="3">
  //             <FormGroup>
  //               <Label htmlFor="name">نام عارضه</Label>
  //               <Input
  //                 type="text"
  //                 id="title"
  //                 value={features.name}
  //                 onChange={featureHandleChange('name')}
  //                 placeholder= {features.name}
  //                 required
  //               />
  //             </FormGroup>
  //           </Col>
  //           <Col xs="3">
  //             <FormGroup>
  //               <Label htmlFor="label">لایه</Label>
  //               <Input
  //                 type="select"
  //                 id="layer"
  //                 value={features.layerID}
  //                 onChange={featureHandleChange('layerID')}
  //                 required
  //               >
  //                 {
  //                   layers.length > 0 ?
  //                       layers.map((item, index) =>(
  //                         <option key={index} value={item._id}>{item.name}</option>
  //                       ))
  //                     :  null
  //                 }
  //               </Input>
  //             </FormGroup>
  //           </Col>
  //         </FormGroup>
  //         {/*<Row>*/}
  //         {/*  <Col xs="4">*/}
  //         {/*    <FormGroup>*/}
  //         {/*      <Label htmlFor="name">اطلاعات توصیفی</Label>*/}
  //         {/*      <Input*/}
  //         {/*        type="text"*/}
  //         {/*        id="layerSpecsName"*/}
  //         {/*        value={specs.name}*/}
  //         {/*        placeholder= 'نام اطلاعات توصیفی موردنظر را وارد کنید'*/}
  //         {/*        required*/}
  //         {/*      />*/}
  //         {/*    </FormGroup>*/}
  //         {/*  </Col>*/}
  //         {/*  <Button type="submit" size="sm" color="success" className={classes.buttonStyle} onClick={()=>clickCreateSpecs()}>*/}
  //         {/*    <strong>ایجاد</strong>*/}
  //         {/*  </Button>*/}
  //         {/*</Row>*/}
  //
  //       </CardBody>
  //       <CardFooter>
  //         <Button type="submit" size="sm" color="primary"  onClick={() => clickSubmit()}>
  //           <strong>ثبت</strong>
  //         </Button>
  //       </CardFooter>
  //     </Card>
  //   </div>
  // )
};
export default EditFeature;

