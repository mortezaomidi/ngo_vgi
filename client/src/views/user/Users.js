import React, { useEffect,useState } from 'react';
import {Button, Card, CardBody, CardHeader, Col, Row, Spinner, Table} from 'reactstrap';
import {list, remove} from "./UserAPI";
import auth from '../../auth/auth-helper';
import {Link} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Users = (props) =>{
  const [users, setUsers] = useState([]);
  const [loading, isLoading] = useState(true);

  useEffect(()=>{
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((response)=>{
      if (response.error) {
        console.log(response.error)
      } else {
        setUsers(response);
        isLoading(false);
      }
    })
  },[]);

  const deleteUser = (id,index)=>{
    remove({
      userId: id
    }).then((response)=>{
        const tempUsers= [...users];
        tempUsers.splice(index,1);
        setUsers(tempUsers)
    })
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
                          <th scope="col">شناسه کاربر</th>
                          <th scope="col">ایمیل</th>
                          <th scope="col">نام</th>
                          <th scope="col">تاریخ ثبت نام</th>
                          <th scope="col">تاریخ ویرایش</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          users.length > 0 ?
                            users.map((item, index)=>{
                              const userProfile = `/users/${item._id}`;
                              const createdDate = new Date(item.createdAt).toLocaleDateString('fa-IR');
                              const updatedDate = new Date(item.updatedAt).toLocaleDateString('fa-IR');

                              return(
                                <tr key={item._id}>
                                  <td>
                                    {item._id ? item._id : "***"}
                                  </td>
                                  <td>
                                    {item.email ? item.email : "***"}
                                  </td>
                                  <td>
                                    {item.name ? item.name : "***"}
                                  </td>
                                  <td>
                                    { item.createdAt ? createdDate : "***"}
                                  </td>
                                  <td>
                                    { item.updatedAt ? updatedDate : "***"}
                                  </td>
                                  <td>
                                    <div style={{display:'flex',justifyContent:'space-evenly'}}>
                                      <Link to={userProfile}>
                                        <Button size="sm" color="primary">
                                          ویرایش
                                        </Button>
                                      </Link>
                                      <Button size="sm" color="danger" onClick={()=>deleteUser(item._id, index)}>
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
    </div>
  )
};

export default Users;
