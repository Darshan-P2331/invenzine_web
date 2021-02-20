import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { faTrash, faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import firebase, { firestore, storage } from "../firebase";
import "./style.css";

export class Draft extends Component {
  constructor() {
    super();
    this.state = {
      boards: [],
      totalPost: 0,
      lastViewed: null
    };
    this.delete = this.delete.bind(this);
    this.post = this.post.bind(this);
  }

  async getData(user) {
    const posts = await firestore
      .collection("DraftNews")
      .where("adminname", "==", user)
      .limit(9);

    posts.onSnapshot((querySnapshot) => {
      this.setState({
        lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      const boards = [];
      querySnapshot.forEach((docs) => {
        const { title, imgUrl, ImageFileName } = docs.data();
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          ImageFileName,
        });
      });
      this.setState({
        boards,
      });
    });
  }

  async getDataLater(lastViewed, user) {
    const posts = await firestore
      .collection("DraftNews")
      .where("adminname", "==", user)
      .startAfter(lastViewed)
      .limit(9);
    posts.onSnapshot((querySnapshot) => {
      this.setState({
        lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      const boards = [];
      querySnapshot.forEach((docs) => {
        const { title, imgUrl, ImageFileName } = docs.data();
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          ImageFileName,
        });
      });
      this.setState({
        boards: this.state.boards.concat(boards),
      });
    });
  }

  handleclick() {
    this.getDataLater(this.state.lastViewed, this.state.admin);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      firestore
        .collection("DraftNews")
        .where("adminname", "==", user.displayName)
        .onSnapshot(querysnapshot => {
            this.setState({
                totalPost: querysnapshot.docs.length
            })
        })
        this.getData(user.displayName)
    });
  }

  post(id) {
    firestore
      .collection("DraftNews")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          firestore.collection("News").add(doc.data()).then(this.delete(id));
        }
      });
  }

  delete(id, imgname) {
    if (imgname) {
      storage
        .ref("/NewsImages/" + imgname)
        .delete()
        .then(function () {
          firestore
            .collection("DraftNews")
            .doc(id)
            .delete()
            .then(() => {
              console.log("Delete successful");
            });
        });
    } else {
      firestore
        .collection("DraftNews")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Delete successful");
        });
    }
  }

  render() {
    return (
      <Container className="pt-3">
        {this.state.boards.length > 0 ? (
          <Row>
            {this.state.boards.map((board) => (
              <Col lg={4} md={6} className="p-0">
                <Card className="mb-5" style={{ width: "300px" }}>
                  <Card.Img src={board.imgUrl} />
                  <Card.Body>
                    <Card.Title>{board.title}</Card.Title>
                  </Card.Body>
                  <Card.Footer style={{ justifyContent: "space-between" }}>
                    <Button
                      variant="danger"
                      onClick={(e) =>
                        this.delete(board.key, board.ImageFileName)
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />{" "}
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={(e) => this.post(board.key)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Post{" "}
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
            {this.state.boards.length < this.state.totalPost ? (
              <Button variant="light" onClick={this.handleclick}>
                Load more <FontAwesomeIcon icon={faChevronDown} />
              </Button>
            ) : (
              ""
            )}
            {/* {this.state.boards.map((board) => (
                            <Col lg={4} md={6} className='p-0'>
                                <Card className='text-white mb-5' >
                                    <Card.Img src={board.imgUrl} />
                                    <Card.ImgOverlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                                        <Card.Title>
                                            {board.title}
                                        </Card.Title>
                                        <Card.Subtitle>
                                            {board.likes}
                                        </Card.Subtitle>
                                        <div style={{ marginLeft: '15.8rem', marginTop: '4.8rem' }}>
                                            <NavDropdown title='' id="basic-nav-dropdown">
                                                <NavDropdown.Item href="#action/3.1" className='text-danger' onClick={e => this.delete(board.key, board.ImageFileName)}><FontAwesomeIcon icon={faTrash} />&nbsp;Delete</NavDropdown.Item>
                                                <NavDropdown.Item href="#action/3.2" className='text-success' onClick={e => this.post(board.key)}><FontAwesomeIcon icon={faCheck} />&nbsp;Post</NavDropdown.Item>
                                            </NavDropdown>
                                        </div>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                        ))} */}
          </Row>
        ) : (
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column">
              <h1 className="text-secondary" style={{ marginTop: "250%" }}>
                Empty
              </h1>
            </div>
          </div>
        )}
      </Container>
    );
  }
}

export default Draft;
