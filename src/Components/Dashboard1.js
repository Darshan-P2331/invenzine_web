import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  faTrash,
  faEdit,
  faChevronDown,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { firestore, storage } from "../firebase";
import "./style.css";
import Comments from "./Comments";

export default class Dashboard1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: [],
      lastViewed: null,
      totalPost: 0,
      admin: "",
      show: false,
      id: null,
    };
    this.delete = this.delete.bind(this);
    this.handleclick = this.handleclick.bind(this);
  }

  async getData(user) {
    const posts = await firestore
      .collection("News")
      .where("aemail", "==", user)
      .orderBy("date", "desc")
      .limit(9);
    posts.onSnapshot((querySnapshot) => {
      this.setState({
        lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      const boards = [];
      querySnapshot.forEach((docs) => {
        const { title, imgUrl, adminname, ImageFileName } = docs.data();
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          adminname,
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
      .collection("News")
      .where("aemail", "==", user)
      .orderBy("date", "desc")
      .startAfter(lastViewed)
      .limit(9);
    posts.onSnapshot((querySnapshot) => {
      this.setState({
        lastViewed: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      const boards = [];
      querySnapshot.forEach((docs) => {
        const { title, imgUrl, adminname, desc, ImageFileName } = docs.data();
        boards.push({
          key: docs.id,
          title,
          imgUrl,
          desc,
          adminname,
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
    firestore
      .collection("News")
      .where("aemail", "==", this.props.match.params.aemail)
      .onSnapshot((querysnapshot) => {
        this.setState({
          totalPost: querysnapshot.docs.length,
          admin: this.props.match.params.aemail,
        });
        this.getData(this.props.match.params.aemail);
      });
  }

  delete(id, imgname) {
    storage
      .ref("/NewsImages/" + imgname)
      .delete()
      .then(function () {
        firestore
          .collection("News")
          .doc(id)
          .delete()
          .then(() => {
            console.log("Delete successful");
            alert("Deleted successfully");
          });
      });
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
                      style={{
                        borderRadius: "50%",
                        padding: "10px 0",
                        width: "50px",
                        marginRight: "2em",
                      }}
                      variant="danger"
                      onClick={(e) =>
                        this.delete(board.key, board.ImageFileName)
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />{" "}
                    </Button>
                    <Button
                      style={{
                        borderRadius: "50%",
                        padding: "10px 0",
                        width: "50px",
                      }}
                      variant="warning"
                      href={"/admin/edit/" + board.key}
                    >
                      <FontAwesomeIcon icon={faEdit} />{" "}
                    </Button>
                    <Button
                      style={{
                        borderRadius: "50%",
                        padding: "10px 0",
                        width: "50px",
                        marginLeft: "2em",
                      }}
                      variant="outline-primary"
                      onClick={() =>
                        this.setState({ show: true, id: board.key })
                      }
                    >
                      <FontAwesomeIcon icon={faComment} />{" "}
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
          </Row>
        ) : (
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column">
              <h1 className="text-secondary" style={{ marginTop: "250%",marginBottom: "100%" }}>
                Empty
              </h1>
            </div>
          </div>
        )}
        <Comments
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          id={this.state.id}
          super={true}
        />
      </Container>
    );
  }
}
