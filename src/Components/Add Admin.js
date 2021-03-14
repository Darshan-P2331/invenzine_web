import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import React, { Component } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { firestore } from "../firebase";

class AddAdmin extends Component {
  constructor() {
    super();
    this.state = {
      admins: [],
    };
    this.removeAdmin = this.removeAdmin.bind(this);
    this.addAdmin = this.addAdmin.bind(this);
  }

  componentDidMount() {
    firestore.collection("LocalAdmins").onSnapshot((querysnapshot) => {
      const admins = [];
      querysnapshot.forEach((admin) => {
        const { Username, Email, ApprovalStatus } = admin.data();
        admins.push({
          key: admin.id,
          Username,
          Email,
          ApprovalStatus,
        });
      });
      this.setState({ admins });
      console.log(this.state.admins);
    });
  }

  removeAdmin(id) {
    firestore.collection("LocalAdmins").doc(id).update({
      ApprovalStatus: false,
    });
  }
  addAdmin(id) {
    firestore
      .collection("LocalAdmins")
      .doc(id)
      .update({
        ApprovalStatus: true,
      })
      .then(() => console.log("Success"));
  }

  render() {
    return (
      <Container className="py-5">
        <Row>
          {this.state.admins.map(admin => (
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Name: {admin.Username}</Card.Title>
                  <Card.Text>Email: {admin.Email}</Card.Text>
                  <a href={"/admin/dashboard/"+admin.Email}>View Posts <FontAwesomeIcon icon={faChevronRight}/></a>
                  <div className="d-flex mt-3">
                    {admin.ApprovalStatus ? (
                      <Button
                        variant="danger"
                        onClick={(e) => this.removeAdmin(admin.key)}
                      >
                        <FontAwesomeIcon icon={faUserMinus} /> Remove
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={(e) => this.addAdmin(admin.key)}
                      >
                        <FontAwesomeIcon icon={faUserPlus} /> Approve
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {/* <Table striped bordered hover className='mt-5'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.admins.map((admin, index) => (
                            <tr>
                                <td>{index+1}</td>
                                <td>{admin.Username}</td>
                                <td>{admin.Email}</td>
                                <td>{admin.ApprovalStatus ? 
                                    <Button variant='danger' onClick={e => this.removeAdmin(admin.key)}><FontAwesomeIcon icon={faUserMinus} /> Remove</Button> 
                                : 
                                    <Button variant='success' onClick={e => this.addAdmin(admin.key)}><FontAwesomeIcon icon={faUserPlus} /> Approve</Button>
                                }
                                </td>
                            </tr>
                        ))}
                        
                    </tbody>
                </Table> */}
      </Container>
    );
  }
}

export default AddAdmin;
